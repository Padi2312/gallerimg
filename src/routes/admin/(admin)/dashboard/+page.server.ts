import { getImageCount, getMostDownloadedImages, getUsedStorage } from "$lib/server/core/images";
import { formatBytes } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const imageCount = await getImageCount();
    const usedStorage = await getUsedStorage();
    const usedStorageFormated = formatBytes(usedStorage);
    const mostDownloadedImages = (await getMostDownloadedImages(1))[0];
    return {
        imageCount,
        usedStorage: usedStorageFormated,
        mostDownloadedImages
    }
}