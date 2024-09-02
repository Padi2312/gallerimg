import type { SettingsModel } from "$lib/server/types/database-types";
import type Database from "../database";
import { BaseRepository } from "../repository";

export class SettingsRepository extends BaseRepository<SettingsModel> {
    constructor(db: Database) {
        super(db, 'settings');
    }
}