import { getImagesWithoutFolder } from "$lib/server/core/images"
import { foldersService } from "$lib/server/services"

export const load = async () => {
    return {
        images: await getImagesWithoutFolder(),
        folders: await foldersService.getFoldersWithImages()
    }
}