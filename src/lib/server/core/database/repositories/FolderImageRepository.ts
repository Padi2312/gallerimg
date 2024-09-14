import type { FolderImageModel } from "../../../types/database-types";
import type Database from "../database";
import { BaseRepository } from "../repository";

export class FolderImagesRepository extends BaseRepository<FolderImageModel> {

    constructor(db: Database) {
        super(db, 'folder_images');
    }

    async deleteImageInFolder(folderId: string, imageId: string) {
        return await this.db.run(`DELETE FROM folder_images WHERE folder_id = $1 AND image_id = $2`, [folderId, imageId]);
    }
}