import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session) {
        return {
            status: 401
        }
    } else {
        return {
            session
        }
    }
}