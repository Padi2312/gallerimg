import { settingsRepository } from "../database";

export const getSettings = async () => {
    const settings = await settingsRepository.findAll();
    return {
        settings
    };
}

