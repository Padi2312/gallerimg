import { deleteImage, updateImage } from '$lib/server/core/images';
import { errorResponse } from '$lib/server/utils';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return errorResponse(401, 'Unauthorized');
    }

    const id = Number(params.id);
    if (isNaN(id)) {
        return errorResponse(400, 'Invalid ID');
    }

    const body = await request.json();
    try {
        updateImage(id, body);
        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        return errorResponse(500, JSON.stringify({ error }));
    }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return errorResponse(401, 'Unauthorized');
    }

    const id = Number(params.id);
    if (isNaN(id)) {
        return errorResponse(400, 'Invalid ID');
    }

    try {
        await deleteImage(id);
        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        return errorResponse(500, JSON.stringify({ error }));
    }
};