import { getAllImages } from "$lib/server/core/images";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
    const images = getAllImages();
    return {
        images
    }
}