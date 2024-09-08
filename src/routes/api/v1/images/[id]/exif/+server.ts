import { metadataRepository } from "$lib/server/core/database";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
    const id = params.id;
    if (!id) {
        return new Response("No image id provided", { status: 400 });
    }

    const imageMetaData = await metadataRepository.findByImageId(id);
    if (!imageMetaData) {
        return new Response("No metadata found for image", { status: 404 });
    }

    return json(imageMetaData);
}