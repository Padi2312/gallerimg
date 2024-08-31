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
    const imageProcessings = images.map(async (img) => await getExifData(img.filename))

    const exifList = await Promise.allSettled(imageProcessings)
    const exifListData = exifList.map((exif) => {
        if (exif.status === "fulfilled") {
            return exif.value
        }
    })

    const insertProcessings = exifListData.map(async (exif, index) => {
        try {
            await metadataRepository.create({
                image_id: images[index].id,
                exif_data: JSON.stringify(exif) as unknown as ExifReader.Tags
            })
        } catch (err) {
            const error = err as pg.DatabaseError
            if (error.code == PostgresError.UNIQUE_VIOLATION) {
                logger.debug(`Metadata for image ${images[index].id} already exists. Skipping...`)
            } else {
                logger.error(error)
            }
        }
    })
    const insertResults = await Promise.allSettled(insertProcessings)
    insertResults.forEach((result) => {
        if (result.status === "rejected") {
            logger.error("Error inserting metadata:", result.reason)
        }
    })

    const amountOfImages = images.length
    return json({ updated: amountOfImages })
}