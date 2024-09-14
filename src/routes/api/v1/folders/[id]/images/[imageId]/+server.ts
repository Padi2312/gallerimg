import { foldersService } from "$lib/server/services";
import { errorResponse } from "$lib/server/utils";
import type { RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params }) => {
    const folderId = params.id;
    const imageId = params.imageId;

    if (!folderId || !imageId) {
        return errorResponse(400, 'No folder id or image id provided');
    }

    await foldersService.deleteImageInFolder(folderId, imageId);

    return new Response(null, { status: 204 });
}