import { database } from "$lib/core";
import { ImagesRepository } from "./ImagesRepository";
import { ImageTagsRepository } from "./ImageTagRepository";
import { TagsRepository } from "./TagsRepository";

const tagsRepository = new TagsRepository(database);
const imageTagsRepository = new ImageTagsRepository(database);
const imagesRepository = new ImagesRepository(database, tagsRepository, imageTagsRepository);

export {
    imagesRepository, imageTagsRepository, tagsRepository
};

