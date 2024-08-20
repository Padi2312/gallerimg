import { getImageAmount } from "$lib/core/images";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const imageCount = getImageAmount();
    return {
        imageCount
    }
}