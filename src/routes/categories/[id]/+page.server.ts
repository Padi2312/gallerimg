import { foldersService } from "$lib/server/services";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    const firstSeparator = id.indexOf("-")
    const folderId = id.slice(firstSeparator + 1)
    const folder = await foldersService.getFolderWithImagesById(folderId);
    if (!folder) {
        throw new Error(`Folder with id ${id} not found`);
    }

    return {
        folder: folder
    }
}