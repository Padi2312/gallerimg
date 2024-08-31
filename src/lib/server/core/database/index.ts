import { database } from "$lib/server/core";
import { ImagesRepository } from "./repositories/ImagesRepository";
import { ImageTagsRepository } from "./repositories/ImageTagRepository";
import { MetadataRepository } from "./repositories/MetadataRepository";
import { SettingsRepository } from "./repositories/SettingsRepository";
import { TagsRepository } from "./repositories/TagsRepository";

const tagsRepository = new TagsRepository(database);
const imageTagsRepository = new ImageTagsRepository(database);
const imagesRepository = new ImagesRepository(database, tagsRepository, imageTagsRepository);
const settingsRepository = new SettingsRepository(database);
const metadataRepository = new MetadataRepository(database);

export {
    imagesRepository, imageTagsRepository, settingsRepository, tagsRepository, metadataRepository
};

