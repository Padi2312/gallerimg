import type { MetadataModel } from "$lib/server/types/database-types";
import type Database from "../database";
import { BaseRepository } from "../repository";

export class MetadataRepository extends BaseRepository<MetadataModel> {
    constructor(db: Database) {
        super(db, 'metadata');
    }

    async findByImageId(imageId: string): Promise<MetadataModel | null> {
        const query = `SELECT * FROM metadata WHERE image_id = $1`;
        const result = await this.db.get<MetadataModel>(query, [imageId]);
        if (!result) {
            return null;
        }
        return result;
    }

    async getImagesWithoutMetadata(): Promise<string[]> {
        const query = `
            SELECT images.id
            FROM images
            LEFT JOIN metadata ON images.id = metadata.image_id
            WHERE metadata.image_id IS NULL
        `;
        const result = await this.db.all<{ id: string }>(query);
        return result.map(row => row.id);
    }
}