import { getAllTags } from "$lib/server/core/tags";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const tags = await getAllTags();
    return {
        tags
    }
}