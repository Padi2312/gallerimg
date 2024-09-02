import { logger } from "$lib";
import { newslettersRepository } from "$lib/server/core/database";
import { errorResponse } from "$lib/server/utils";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    try {
        await newslettersRepository.create({
            email: body.email,
        }, null)
        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        logger.error(error);
        return errorResponse(500, JSON.stringify({ error }));
    }
}

export const DELETE: RequestHandler = async ({ url }) => {
    const email = url.searchParams.get('email');
    if (!email) {
        return errorResponse(400, 'Invalid email');
    }

    try {
        await newslettersRepository.deleteByEmail(email);
        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        logger.error(error);
        return errorResponse(500, JSON.stringify({ error }));
    }
}