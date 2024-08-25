import { tagsRepository } from "../database/repositories"

export const getAllTags = () => {
    const tags = tagsRepository.findAll()
    return tags
}

export const insertTagIfNotExists = (name: string): number => {
    const tag = tagsRepository.findByName(name)
    if (tag) {
        return tag.id
    }
    return tagsRepository.create({ name })!
}