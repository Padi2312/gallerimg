import { logger } from "$lib";
import { newslettersRepository } from "$lib/server/core/database";
import { mailService } from "$lib/server/services";
import { errorResponse } from "$lib/server/utils";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const email = body.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        return errorResponse(400, 'Invalid email');
    }

    if (!emailRegex.test(email)) {
        return errorResponse(400, 'Invalid email format');
    }

    try {
        await newslettersRepository.create({
            email,
        }, null)
        mailService.sendWelcomeMail(email);
        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        logger.error(error);
        return errorResponse(500, JSON.stringify({ error }));
    }
}

export const DELETE: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
        return errorResponse(400, 'Invalid id');
    }

    try {
        await newslettersRepository.delete(id);
        return new Response(null, {
            status: 204,
        });
    } catch (error) {
        logger.error(error);
        return errorResponse(500, JSON.stringify({ error }));
    }
}