import type Database from "../database";
import { BaseRepository } from "../repository";
import type { ImageModel, ImageTagModel, TagModel } from "../../../../types/databaseTypes";

export class ImageTagsRepository extends BaseRepository<ImageTagModel> {
    constructor(db: Database) {
        super(db, 'image_tags');
    }

    addTagToImage(imageId: number, tagId: number): boolean {
        const query = 'INSERT OR IGNORE INTO image_tags (image_id, tag_id) VALUES (?, ?)';
        const result = this.db.run(query, [imageId, tagId]);
        return result !== undefined;
    }

    removeTagFromImage(imageId: number, tagId: number): boolean {
        const query = 'DELETE FROM image_tags WHERE image_id = ? AND tag_id = ?';
        const result = this.db.run(query, [imageId, tagId]);
        return result !== undefined && result.changes > 0;
    }

    getTagsForImage(imageId: number): TagModel[] {
        const query = `
            SELECT t.* 
            FROM tags t
            JOIN image_tags it ON t.id = it.tag_id
            WHERE it.image_id = ?
        `;
        return this.db.all<TagModel>(query, [imageId]) || [];
    }

    getImagesForTag(tagId: number): ImageModel[] {
        const query = `
            SELECT i.* 
            FROM images i
            JOIN image_tags it ON i.id = it.image_id
            WHERE it.tag_id = ?
        `;
        return this.db.all<ImageModel>(query, [tagId]) || [];
    }
}
