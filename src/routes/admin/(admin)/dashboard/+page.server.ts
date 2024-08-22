import { getImageCount, getUsedStorage } from "$lib/server/core/images";
import { formatBytes } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const imageCount = getImageCount();
    const usedStorage = await getUsedStorage();
    const usedStorageFormated = formatBytes(usedStorage);
    return {
        imageCount,
        usedStorage: usedStorageFormated
    }
}