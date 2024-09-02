import type { ImageModel, ImageTagModel, TagModel } from "../../../types/database-types";
import type Database from "../database";
import { BaseRepository } from "../repository";

export class ImageTagsRepository extends BaseRepository<ImageTagModel> {
    constructor(db: Database) {
        super(db, 'image_tags');
    }

    async addTagToImage(imageId: string, tagId: string): Promise<boolean> {
        const query = 'INSERT INTO image_tags (image_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
        const result = await this.db.run(query, [imageId, tagId]);
        return (result.rowCount ?? 0) > 0;
    }

    async removeTagFromImage(imageId: string, tagId: string): Promise<boolean> {
        const query = 'DELETE FROM image_tags WHERE image_id = $1 AND tag_id = $2';
        const result = await this.db.run(query, [imageId, tagId]);
        return (result.rowCount ?? 0) > 0;
    }

    async getTagsForImage(imageId: string): Promise<TagModel[]> {
        const query = `
            SELECT t.* 
            FROM tags t
            JOIN image_tags it ON t.id = it.tag_id
            WHERE it.image_id = $1
        `;
        return await this.db.all<TagModel>(query, [imageId]) || [];
    }

    async getImagesForTag(tagId: string): Promise<ImageModel[]> {
        const query = `
            SELECT i.* 
            FROM images i
            JOIN image_tags it ON i.id = it.image_id
            WHERE it.tag_id = $1
        `;
        return await this.db.all<ImageModel>(query, [tagId]) || [];
    }
}
