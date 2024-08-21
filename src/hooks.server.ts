import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import { logger } from "$lib";
import { database } from "$lib/core";
import { initImages } from "$lib/core/images";
export { handle } from "./auth"


if (!building) {
    logger.setLevel(Number(env.LOG_LEVEL) ?? 1);
    database.init()
    await initImages()
}