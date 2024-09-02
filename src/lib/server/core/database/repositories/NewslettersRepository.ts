import type { NewsletterModel } from "$lib/types/database-types";
import type Database from "../database";
import { BaseRepository } from "../repository";

export class NewslettersRepository extends BaseRepository<NewsletterModel> {
    constructor(db: Database) {
        super(db, 'newsletters');
    }

    async findByEmail(email: string): Promise<NewsletterModel | null> {
        const query = `SELECT * FROM newsletters WHERE email = $1`;
        const result = await this.db.get<NewsletterModel>(query, [email]);
        if (!result) {
            return null;
        }
        return result;
    }

    async deleteByEmail(email: string): Promise<boolean> {
        const query = `DELETE FROM newsletters WHERE email = $1`;
        const result = await this.db.run(query, [email]);
        return (result.rowCount ?? 0) > 0;
    }
}