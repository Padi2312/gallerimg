import { imagesRepository } from '$lib/server/core/database';
import { loadImage } from '$lib/server/core/images';
import { errorResponse } from '$lib/server/utils';
import sharp from 'sharp';
import type { RequestHandler } from './$types';
import { logger } from '$lib';

export const GET: RequestHandler = async ({ params, url, request }) => {
    const filename = params.name as string;
    const width = url.searchParams.get('width');
    const height = url.searchParams.get('height');
    const download = url.searchParams.get('download');

    const headers: HeadersInit = {
        'Content-Type': 'image/jpeg',
    }
    if (download == "true") {
        headers['Content-Disposition'] = `attachment; filename="${filename}"`;
        const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        logger.info(`Download request for ${filename} from IP: ${clientIP}, User-Agent: ${userAgent}`);
    }
    try {
        const imageBuffer = await loadImage(filename);
        const resizedImageBuffer = sharp(imageBuffer)

        if (!width && !height) {
            return new Response(imageBuffer, {
                headers
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
            headers
        });
    } catch (error) {
        logger.error(error);
        return errorResponse(404, 'Image not found');
    } finally {
        if (download == "true") {
            imagesRepository.incrementDownloadCountByFileName(filename);
        }
    }
};

