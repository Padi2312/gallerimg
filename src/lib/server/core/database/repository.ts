import { logger } from "$lib";
import type Database from "./database";

export abstract class BaseRepository<T> {
    protected db: Database;
    protected tableName: string;

    constructor(db: Database, tableName: string) {
        this.db = db;
        this.tableName = tableName;
    }

    count(): number {
        const query = `SELECT COUNT(*) FROM ${this.tableName}`;
        const result = this.db.get<{ 'COUNT(*)': number }>(query);
        if (!result) {
            logger.warn(`No records found in ${this.tableName}`);
            return 0;
        }
        return result['COUNT(*)'];
    }

    findAll(): T[] {
        const query = `SELECT * FROM ${this.tableName}`;
        const results = this.db.all<T>(query);
        if (!results) {
            logger.warn(`No results found in ${this.tableName}`);
            return [];
        }
        return results;
    }

    findById(id: number): T | null {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const result = this.db.get<T>(query, [id]);
        if (!result) {
            logger.warn(`No record found in ${this.tableName} with id ${id}`);
            return null;
        }
        return result;
    }

    create(data: Partial<T>): number | null {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');
        const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
        const result = this.db.run(query, values);
        if (!result) {
            logger.error(`Failed to insert into ${this.tableName}`);
            return null;
        }
        return result.lastInsertRowid as number;
    }

    update(id: number, data: Partial<T>): boolean {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
        const result = this.db.run(query, [...values, id]);
        if (!result) {
            logger.error(`Failed to update ${this.tableName} with id ${id}`);
            return false;
        }
        return result.changes > 0;
    }

    delete(id: number): boolean {
        const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const result = this.db.run(query, [id]);
        if (!result) {
            logger.error(`Failed to delete from ${this.tableName} with id ${id}`);
            return false;
        }
        return result.changes > 0;
    }
}
