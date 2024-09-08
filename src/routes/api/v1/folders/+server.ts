import { foldersRepository } from "$lib/server/core/database";
import { errorResponse } from "$lib/server/utils";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    try {
        const folders = await foldersRepository.findRoots();
        return json(folders);
    } catch (error) {
        return errorResponse(500, JSON.stringify(error));
    }
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { name, parentId } = await request.json();
        const parent = parentId ? await foldersRepository.findById(parentId) : null;
        if (parentId && !parent) {
            return errorResponse(400, `No folder found with id ${parentId}`);
        }
        const folder = await foldersRepository.create({ name });
        return new Response(null, { status: 201 });
        return json(folder);
    } catch (error) {
        return errorResponse(500, JSON.stringify(error));
    }
}

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const folderId = params.id;
        if (!folderId) {
            return errorResponse(400, "No folder id provided");
        }

        const folder = await foldersRepository.findById(folderId);
        if (!folder) {
            return errorResponse(404, `No folder found with id ${folderId}`);
        }

        await foldersRepository.delete(folderId);
        return json({ success: true });
    } catch (error) {
        return errorResponse(500, JSON.stringify(error));
    }
}
