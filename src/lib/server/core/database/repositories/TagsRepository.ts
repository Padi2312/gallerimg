import type Database from "../database";
import { BaseRepository } from "../repository";
import type { TagModel } from "../../../../types/databaseTypes";

export class TagsRepository extends BaseRepository<TagModel> {
    constructor(db: Database) {
        super(db, 'tags');
    }

    findByName(name: string): TagModel | null {
        const query = 'SELECT * FROM tags WHERE name = ?';
        return this.db.get<TagModel>(query, [name]) || null;
    }

    getOrCreate(name: string): number {
        const existingTag = this.findByName(name);
        if (existingTag) return existingTag.id;
        const newTagId = this.create({ name });
        if (newTagId === null) throw new Error(`Failed to create tag: ${name}`);
        return newTagId;
    }
}
