import { folderImagesRepository } from "$lib/server/core/database";
import { errorResponse } from "$lib/server/utils";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return errorResponse(401, 'Unauthorized');
    }
    const { folderId, imageId } = await request.json();
    if (!folderId || !imageId) {
        return errorResponse(400, 'No folderId or imageIds provided');
    }

    await folderImagesRepository.create({
        folder_id: folderId,
        image_id: imageId
    }, null);
    return new Response(null, { status: 201 });
}

