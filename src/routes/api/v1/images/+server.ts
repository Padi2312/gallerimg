import { logger } from "$lib";
import { deleteImage, saveImage } from "$lib/server/core/images";
import { errorResponse } from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { mailService } from "$lib/server/services";

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return errorResponse(401, 'Unauthorized');
    }

    const data = await request.formData();
    const files: File[] = data.getAll('images') as File[]; // Assuming form field name is 'images'

    // Array to store paths of uploaded files
    const uploadedFiles = [];
    const failedFiles = [];

    for (const item of files) {
        try {
            const filePath = await saveImage(item)
            uploadedFiles.push(filePath);
        } catch (error) {
            logger.error(error);
            failedFiles.push(item.name)
        }
    }

    try {
        await mailService.publishNewsLetter('New Images uploaded!', `${uploadedFiles.length} new images uploaded.`)
    } catch (error) {
        logger.error(error);
    }

    return json({ success: true, files: uploadedFiles, failed: failedFiles })
}

export const DELETE: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return errorResponse(401, 'Unauthorized');
    }

    const body = await request.json()
    const ids = body.ids as string[]
    try {
        for (const item of ids) {
            await deleteImage(item)
        }
        return new Response(null, { status: 204 })
    } catch (error) {
        logger.error(error);
        return json({ success: false, error }, { status: 500 })
    }
} 