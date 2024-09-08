import { foldersRepository } from "$lib/server/core/database";
import { errorResponse } from "$lib/server/utils";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const { name, parentId } = await request.json();
    if (!name) {
        return errorResponse(400, 'No name provided');
    }
    const parent = parentId ? await foldersRepository.findById(parentId) :
        null;
    if (parentId && !parent) {
        return errorResponse(400, `No folder found with id ${parentId}`);
    }
    await foldersRepository.create({ name });
    return new Response(null, { status: 201 });
}

export const DELETE: RequestHandler = async ({ params }) => {
    const folderId = params.rest;
    if (!folderId) {
        return errorResponse(400, 'No folder id provided');
    }
    const folder = await foldersRepository.findById(folderId);
    if (!folder) {
        return errorResponse(404, `No folder found with id ${folderId}`);
    }
    await foldersRepository.delete(folderId);
    return new Response(null, { status: 204 });
}