import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../../$types";
import { foldersRepository } from "$lib/server/core/database";
import { errorResponse } from "$lib/server/utils";

export const GET: RequestHandler = async ({ params }) => {
    const id = params.id;
    try {
        const folder = await foldersRepository.findById(id);
        return json(folder);
    } catch (error) {
        return errorResponse(500, JSON.stringify(error));
    }
}