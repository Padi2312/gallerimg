import type { TagModel } from "$lib/types/database-types"
import { tagsRepository } from "../database"

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