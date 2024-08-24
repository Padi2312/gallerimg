import type { ImageDto } from '$lib/types';
import * as crypto from 'crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { imagesRepository } from "../database/repositories";
import { logger } from '$lib';
import { createHash } from '$lib/utils';

const IMAGE_FOLDER = "data/images";

export const initImages = async () => {
    // Ensure the uploads directory exists
    if (!await fs.stat(IMAGE_FOLDER).catch(() => null)) {

        await fs.mkdir(IMAGE_FOLDER, { recursive: true })
        logger.info('Images directory path:', IMAGE_FOLDER)
    }
}

export const getImagePath = (filename: string): string => path.join(IMAGE_FOLDER, filename)

export const getImageCount = (): number => {
    return imagesRepository.count()
}

export const getUsedStorage = async (): Promise<number> => {
    const files = await fs.readdir(IMAGE_FOLDER);
    const filePaths = files.map(file => path.join(IMAGE_FOLDER, file));
    let totalBytes = 0
    for (const file of filePaths) {
        const bunFile = Bun.file(file)
        totalBytes += bunFile.size
    }
    return totalBytes
}

export const saveImage = async (file: File): Promise<string> => {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = createHash(buffer);
        // Check if the image already exists in the database
        // If it does, return the path to the image
        const image = imagesRepository.findByHash(hash)
        if (image !== null) {
            return getImagePath(image.filename)
        }

        const fileName = crypto.randomUUID() + path.extname(file.name); // Random file name with original extension
        const filePath = getImagePath(fileName);

        await fs.writeFile(filePath, buffer)

        imagesRepository.create({
            filename: fileName,
            hash,
        })
        return filePath
    } catch (error) {
        throw error
    }

}

export const loadImage = async (filename: string): Promise<Buffer> => {
    const filePath = getImagePath(filename);
    return await fs.readFile(filePath)
}

export const deleteImage = async (id: number): Promise<void> => {
    const image = imagesRepository.findById(id)
    if (image === null) {
        throw new Error('Image not found')
    }
    const filePath = getImagePath(image.filename);
    await fs.unlink(filePath)
    imagesRepository.delete(image.id)
}

export const getAllImages = (): ImageDto[] => {
    return imagesRepository.findAll().map(image => {
        return {
            id: image.id,
            url: `/api/v1/files/${image.filename}`,
            title: image.filename,
            tags: [] as string[],
            createdAt: image.created_at
        } as unknown as ImageDto
    })
}