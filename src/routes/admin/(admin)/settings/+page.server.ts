import { getSettings } from "$lib/server/core/settings";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const settings = await getSettings();
    return {
        settings
    };
}