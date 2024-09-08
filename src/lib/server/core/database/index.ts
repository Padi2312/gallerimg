import { database } from "$lib/server/core";
import { FoldersRepository } from "./repositories/FoldersRepository";
import { ImagesRepository } from "./repositories/ImagesRepository";
import { ImageTagsRepository } from "./repositories/ImageTagRepository";
import { MetadataRepository } from "./repositories/MetadataRepository";
import { NewslettersRepository } from "./repositories/NewslettersRepository";
import { SettingsRepository } from "./repositories/SettingsRepository";
import { TagsRepository } from "./repositories/TagsRepository";

const tagsRepository = new TagsRepository(database);
const imageTagsRepository = new ImageTagsRepository(database);
const imagesRepository = new ImagesRepository(database, tagsRepository, imageTagsRepository);
const settingsRepository = new SettingsRepository(database);
const metadataRepository = new MetadataRepository(database);
const newslettersRepository = new NewslettersRepository(database);
const foldersRepository = new FoldersRepository(database);

export {
    imagesRepository,
    imageTagsRepository,
    metadataRepository,
    newslettersRepository,
    settingsRepository,
    tagsRepository,
    foldersRepository
};

