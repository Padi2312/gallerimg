import { logger } from '$lib';
import { insertTagIfNotExists } from '$lib/server/core/tags';
import type { ExifData, ImageDto } from '$lib/shared/types';
import { createHash } from '$lib/utils';
import * as crypto from 'crypto';
import ExifReader from 'exifreader';
import * as fs from 'fs/promises';
import * as path from 'path';
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

export const getMostDownloadedImages = async (limit: number): Promise<ImageDto[]> => {
    return (await imagesRepository.findMostDownloaded(limit)).map(image => {
        const imgDto: ImageDto = {
            id: image.id!.toString(),
            url: `/api/v1/files/${image.filename}`,
            title: image.filename,
            tags: [],
            createdAt: image.created_at!,
            downloadCount: image.download_count
        }
        return imgDto
    })
}

export const getUsedStorage = async (): Promise<number> => {
    const files = await fs.readdir(IMAGE_FOLDER);
    const filePaths = files.map(file => path.join(IMAGE_FOLDER, file));
    let totalBytes = 0
    for (const file of filePaths) {
        const stats = await fs.stat(file);
        totalBytes += stats.size;
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
    if (!id) {
        logger.error('Failed to save image to database')
        throw new Error('Failed to save image to database')
    }

    const exifData = await getExifData(fileName);
    await metadataRepository.create({
        image_id: id,
        ...exifData
    })

    return filePath
}

export const loadImage = async (filename: string): Promise<Buffer> => {
    const filePath = getImagePath(filename);
    return await fs.readFile(filePath)
}

export const deleteImage = async (id: string): Promise<void> => {
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

export const getImagesWithoutFolder = async (): Promise<ImageDto[]> => {
    return (await imagesRepository.findImagesWithoutFolder()).map(image => {
        const imgDto: ImageDto = {
            id: image.id!.toString(),
            url: `/api/v1/files/${image.filename}`,
            title: image.filename,
            tags: [],
            createdAt: image.created_at!,
            downloadCount: image.download_count
        }
        return imgDto
    })
}

export const updateImage = async (id: string, data: Partial<ImageDto>): Promise<ImageDto> => {
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

export const getExifData = async (file: string | File): Promise<ExifData> => {
    let tags = null
    if (typeof file === 'string') {
        tags = await ExifReader.load(getImagePath(file));
    } else {
        tags = await ExifReader.load(file);
    }

    if (!tags) {
        throw new Error('Failed to read EXIF data')
    }
    function fixTimestampFormat(timestamp: string): string {
        // Replace the first two colons with hyphens to correct the date format
        return timestamp.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    }
    const exifData: ExifData = {
        date_time_original: fixTimestampFormat(tags['DateTimeOriginal']?.description ?? 'N/A'),
        model: tags['Model']?.description,
        f_number: tags['FNumber']?.description,
        exposure_time: tags['ExposureTime']?.description,
        iso: Number(tags['ISOSpeedRatings']?.value),
        focal_length: tags['FocalLength']?.description,
        flash: (tags['Flash']?.value ? true : false) as boolean,
        exposure_bias: Number(tags['ExposureBiasValue']?.description) as unknown as number,
        lens_model: tags['LensModel']?.description,
    }
    return exifData
}