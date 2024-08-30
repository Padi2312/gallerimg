import { getAllImages } from "$lib/server/core/images";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const images = await getAllImages();
    const sortedImages = images.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
    });
    return {
        images: sortedImages
    }
}