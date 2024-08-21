import type Database from "../database";
import { BaseRepository } from "../repository";
import type { ImageModel } from "../../../types/databaseTypes";
import type { ImageTagsRepository } from "./ImageTagRepository";
import type { TagsRepository } from "./TagsRepository";

export class ImagesRepository extends BaseRepository<ImageModel> {
    private tagsRepo: TagsRepository;
    private imageTagsRepo: ImageTagsRepository;

    constructor(db: Database, tagsRepo: TagsRepository, imageTagsRepo: ImageTagsRepository) {
        super(db, 'images');
        this.tagsRepo = tagsRepo;
        this.imageTagsRepo = imageTagsRepo;
    }

    addImageWithTags(imageData: Omit<ImageModel, 'id' | 'created_at'>, tagNames: string[]): number | null {
        return this.db.transaction(db => {
            // Create the image
            const imageId = this.create(imageData);
            if (imageId === null) {
                throw new Error('Failed to create image');
            }

            // Process each tag
            for (const tagName of tagNames) {
                const tagId = this.tagsRepo.getOrCreate(tagName);
                if (tagId === null) {
                    throw new Error(`Failed to create or get tag: ${tagName}`);
                }
                const success = this.imageTagsRepo.addTagToImage(imageId, tagId);
                if (!success) {
                    throw new Error(`Failed to associate tag ${tagName} with image ${imageId}`);
                }
            }

            return imageId;
        });
    }

    findByHash(hash: string): ImageModel | null {
        const query = 'SELECT * FROM images WHERE hash = ?';
        return this.db.get<ImageModel>(query, [hash]) || null
    }

    findByFilename(filename: string): ImageModel | null {
        const query = 'SELECT * FROM images WHERE filename = ?';
        return this.db.get<ImageModel>(query, [filename]) || null;
    }

    getImageWithTags(imageId: number): ImageModel & { tags: string[] } | null {
        const query = `
            SELECT i.*, GROUP_CONCAT(t.name) as tags
            FROM images i
            LEFT JOIN image_tags it ON i.id = it.image_id
            LEFT JOIN tags t ON it.tag_id = t.id
            WHERE i.id = ?
            GROUP BY i.id
        `;
        const result = this.db.get<ImageModel & { tags: string }>(query, [imageId]);
        if (!result) return null;
        return { ...result, tags: result.tags ? result.tags.split(',') : [] };
    }
}