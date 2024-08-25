import { getAllTags } from "$lib/server/core/tags";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ }) => {
    const tags = getAllTags()
    return json({ tags: tags })
}