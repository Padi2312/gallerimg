import { logger } from "$lib";
import { imagesRepository, metadataRepository } from "$lib/server/core/database";
import { getExifData } from "$lib/server/core/images";
import { errorResponse } from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import * as pg from "pg";
import { PostgresError } from "pg-error-enum";
export const GET = async ({ locals }) => {
    const session = await locals.auth();
    if (!session) {
        return errorResponse(401, 'Unauthorized');
    }

    const imageIdsWithoutMetadata = await metadataRepository.getImagesWithoutMetadata();
    const images = await imagesRepository.findByIdList(imageIdsWithoutMetadata)

    const imageExifMap = new Map()
    for (const img of images) {
        const exif = await getExifData(img.filename)
        imageExifMap.set(img.id, exif)
    }

    const exifList = Array.from(imageExifMap.entries())

    for (const [imageId, exif] of exifList) {
        try {
            await metadataRepository.create({
                image_id: imageId,
                ...exif
            })
        } catch (err) {
            const error = err as pg.DatabaseError
            if (error.code == PostgresError.UNIQUE_VIOLATION) {
                logger.debug(`Metadata for image ${imageId} already exists. Skipping...`)
            } else {
                logger.error(error)
            }
        }
    }

    const amountOfImages = images.length
    return json({ updated: amountOfImages })
}