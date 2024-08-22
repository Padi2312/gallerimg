import { deleteImage, loadImage } from '$lib/core/images';
import { errorResponse } from '$lib/server/utils';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
    const id = params.id as string;
    const width = url.searchParams.get('width');
    const height = url.searchParams.get('height');

    try {
        const imageBuffer = await loadImage(id);
        const resizedImageBuffer = sharp(imageBuffer)

        if (!width && !height) {
            return new Response(imageBuffer, {
                headers: {
                    'Content-Type': 'image/jpeg', // Replace with the appropriate content type for your images
                },
            });
        }

        if (width && !height) {
            resizedImageBuffer.resize(parseInt(width));
        }
        else if (!width && height) {
            resizedImageBuffer.resize(null, parseInt(height));
        }
        else {
            resizedImageBuffer.resize(parseInt(width!), parseInt(height!));
        }

        return new Response(await resizedImageBuffer.toBuffer(), {
            headers: {
                'Content-Type': 'image/jpeg', // Replace with the appropriate content type for your images
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Image not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

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