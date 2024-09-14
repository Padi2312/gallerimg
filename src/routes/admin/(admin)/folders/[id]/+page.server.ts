import { foldersService } from "$lib/server/services";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    const folder = await foldersService.getFolderWithImagesById(id);
    if (!folder) {
        throw new Error(`Folder with id ${id} not found`);
    }

    return {
        folder: folder
    }
}