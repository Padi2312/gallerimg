import { foldersService } from "$lib/server/services";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const folders = await foldersService.getRootFolders();
    return {
        folders
    }

}