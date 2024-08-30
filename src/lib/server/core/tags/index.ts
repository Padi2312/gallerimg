import type { TagModel } from "$lib/types/databaseTypes"
import { tagsRepository } from "../database/repositories"

export const getAllTags = async (): Promise<TagModel[]> => {
    const tags = await tagsRepository.findAll()
    return tags
}

export const insertTagIfNotExists = async (name: string): Promise<number | null> => {
    const tag = await tagsRepository.findByName(name)
    if (tag) {
        return tag.id
    }
    return await tagsRepository.create({ name })!
}