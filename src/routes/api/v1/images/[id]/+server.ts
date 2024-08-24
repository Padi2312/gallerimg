import { deleteImage } from '$lib/server/core/images';
import { errorResponse } from '$lib/server/utils';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return errorResponse(401, 'Unauthorized');
    }


    const id = Number(params.id);
    if (isNaN(id)) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        await deleteImage(id);
        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};