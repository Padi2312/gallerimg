import type { ImageModel } from "../../../../types/databaseTypes";
import type Database from "../database";
import { BaseRepository } from "../repository";
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

    async addImageWithTags(imageData: Omit<ImageModel, 'id' | 'created_at'>, tagNames: string[]): Promise<number | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return await this.db.transaction(async _ => {
            // Create the image
            const imageId = await this.create(imageData);
            if (imageId === null) {
                throw new Error('Failed to create image');
            }

            // Process each tag
            for (const tagName of tagNames) {
                const tagId = await this.tagsRepo.getOrCreate(tagName);
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

    async findByHash(hash: string): Promise<ImageModel | null> {
        const query = 'SELECT * FROM images WHERE hash = $1';
        return await this.db.get<ImageModel>(query, [hash]) || null
    }

    async findByFilename(filename: string): Promise<ImageModel | null> {
        const query = 'SELECT * FROM images WHERE filename = ?';
        return await this.db.get<ImageModel>(query, [filename]) || null;
    }

    async findAllWithTags(): Promise<(ImageModel & { tags: string[]; })[]> {
        const query = `
            SELECT i.*, array_remove(array_agg(t.name), NULL) as tags
            FROM images i
            LEFT JOIN image_tags it ON i.id = it.image_id
            LEFT JOIN tags t ON it.tag_id = t.id
            GROUP BY i.id
        `;
        const results = await this.db.all<ImageModel & { tags: string[] }>(query);
        if (!results) return [];
        return results.map(row => ({
            ...row,
            tags: row.tags ?? []
        }));
    }

    async getImageWithTags(imageId: number): Promise<(ImageModel & { tags: string[]; }) | null> {
        const query = `
            SELECT i.*, array_remove(array_agg(t.name), NULL) as tags
            FROM images i
            LEFT JOIN image_tags it ON i.id = it.image_id
            LEFT JOIN tags t ON it.tag_id = t.id
            WHERE i.id = $1
            GROUP BY i.id
        `;
        const result = await this.db.get<ImageModel & { tags: string[] }>(query, [imageId]);
        if (!result) return null;
        return { ...result, tags: result.tags ?? [] };
    }

    async incrementDownloadCountByFileName(filename: string): Promise<boolean> {
        const query = 'UPDATE images SET download_count = download_count + 1 WHERE filename = $1';
        return await this.db.run(query, [filename]) !== undefined;
    }
}