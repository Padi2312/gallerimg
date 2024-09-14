import type { FolderModel } from "../../../types/database-types";
import type Database from "../database";
import { BaseRepository } from "../repository";

export class FoldersRepository extends BaseRepository<FolderModel> {

    constructor(db: Database) {
        super(db, 'folders');
    }
}