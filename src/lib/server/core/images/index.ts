import { logger } from '$lib';
import { insertTagIfNotExists } from '$lib/server/core/tags';
import type { ImageDto } from '$lib/types';
import { createHash } from '$lib/utils';
import * as crypto from 'crypto';
import * as ExifReader from 'exifreader';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { imagesRepository, imageTagsRepository, metadataRepository } from "../database";


const IMAGE_FOLDER = "data/images";

export const initImages = async () => {
    // Ensure the uploads directory exists
    if (!await fs.stat(IMAGE_FOLDER).catch(() => null)) {

        await fs.mkdir(IMAGE_FOLDER, { recursive: true })
        logger.info('Images directory path:', IMAGE_FOLDER)
    }
}

export const getImagePath = (filename: string): string => path.join(IMAGE_FOLDER, filename)

export const getImageCount = async (): Promise<number> => {
    return await imagesRepository.count()
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
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = createHash(buffer);
    // Check if the image already exists in the database
    // If it does, return the path to the image
    const image = await imagesRepository.findByHash(hash)
    if (image !== null) {
        return getImagePath(image.filename)
    }

    const fileName = crypto.randomUUID() + path.extname(file.name); // Random file name with original extension
    const filePath = getImagePath(fileName);

    await fs.writeFile(filePath, buffer)

    const id = await imagesRepository.create({
        filename: fileName,
        hash,
    })
    if (id === null) {
        logger.error('Failed to save image to database')
        throw new Error('Failed to save image to database')
    }

    const exifData = await getExifData(fileName);
    await metadataRepository.create({
        image_id: id,
        exif_data: JSON.stringify(exifData) as unknown as ExifReader.Tags
    })

    return filePath
}

export const loadImage = async (filename: string): Promise<Buffer> => {
    const filePath = getImagePath(filename);
    return await fs.readFile(filePath)
}

export const deleteImage = async (id: number): Promise<void> => {
    const image = await imagesRepository.findById(id)
    if (image === null) {
        throw new Error('Image not found')
    }
    const filePath = getImagePath(image.filename);
    await fs.unlink(filePath)
    await imagesRepository.delete(image.id)
}

export const getAllImages = async (): Promise<ImageDto[]> => {
    return (await imagesRepository.findAllWithTags()).map(image => {
        const imgDto: ImageDto = {
            id: image.id!.toString(),
            url: `/api/v1/files/${image.filename}`,
            title: image.filename,
            tags: image.tags ?? [],
            createdAt: image.created_at!,
            downloadCount: image.download_count
        }
        return imgDto
    })
}

export const updateImage = async (id: number, data: Partial<ImageDto>): Promise<ImageDto> => {
    const image = await imagesRepository.findById(id);
    if (image === null) {
        throw new Error('Image not found');
    }

    // Fetch existing tags for the image
    const existingTags = await imageTagsRepository.getTagsForImage(image.id)
    const tagsToRemove = existingTags.filter(tag => !data.tags?.includes(tag.name));
    const tagsToAdd = data.tags?.filter(tag => !existingTags.map(it => it.name).includes(tag)) ?? []

    for (const tag of tagsToRemove) {
        const tagId = tag?.id
        const success = imageTagsRepository.removeTagFromImage(image.id, tagId);
        if (!success) {
            throw new Error(`Failed to remove tag '${tag}' from image`);
        }
    }

    // Find tags to add (new tags that are not in the existing list)
    for (const tag of tagsToAdd) {
        const tagId = await insertTagIfNotExists(tag);
        if (tagId === null) {
            throw new Error(`Failed to create tag: ${tag}`);
        }
        const success = await imageTagsRepository.addTagToImage(image.id, tagId);
        if (!success) {
            throw new Error(`Failed to associate tag '${tag}' with image`);
        }
    }

    // Return updated image data
    return {
        id: image.id,
        url: `/api/v1/files/${image.filename}`,
        title: data.title ?? image.filename,
        tags: data.tags ?? existingTags,
        createdAt: image.created_at,
        downloadCount: image.download_count
    } as unknown as ImageDto;
};

export const getExifData = async (file: string | File): Promise<ExifReader.Tags> => {
    if (typeof file === 'string') {
        const tags = await ExifReader.load(getImagePath(file));
        return tags
    } else {
        const tags = await ExifReader.load(file);
        return tags
    }
}