import { getAllImages } from "$lib/server/core/images";
import { getAllTags } from "$lib/server/core/tags";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const images = await getAllImages();
    const tags = await getAllTags();

    const sortedImages = images.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
    });
    return {
        images: sortedImages,
        tags
    }
}