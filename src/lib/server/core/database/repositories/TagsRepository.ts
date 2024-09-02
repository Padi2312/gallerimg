import type Database from "../database";
import { BaseRepository } from "../repository";
import type { TagModel } from "../../../types/database-types";

export class TagsRepository extends BaseRepository<TagModel> {
    constructor(db: Database) {
        super(db, 'tags');
    }

    async findByName(name: string): Promise<TagModel | null> {
        const query = 'SELECT * FROM tags WHERE name = $1';
        return await this.db.get<TagModel>(query, [name]) || null;
    }

    async getOrCreate(name: string): Promise<string> {
        const existingTag = await this.findByName(name);
        if (existingTag) return existingTag.id;
        const newTagId = await this.create({ name });
        if (newTagId === null) throw new Error(`Failed to create tag: ${name}`);
        return newTagId;
    }
}
