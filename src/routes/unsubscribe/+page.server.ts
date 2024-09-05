import { logger } from "$lib";
import { newslettersRepository } from "$lib/server/core/database";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
        return { error: 'Invalid email id' };
    }

    try {
        await newslettersRepository.delete(id);
    } catch (error) {
        logger.error(error);
        return { error: JSON.stringify({ error }) };
    }
}