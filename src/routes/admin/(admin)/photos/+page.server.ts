import { getAllImages } from "$lib/core/images";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    const images = getAllImages();
    return {
        images
    }
}