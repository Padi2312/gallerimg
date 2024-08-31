import { logger } from "$lib";
import type Database from "./database";

export abstract class BaseRepository<T> {
    protected db: Database;
    protected tableName: string;

    constructor(db: Database, tableName: string) {
        this.db = db;
        this.tableName = tableName;
    }

    async count(): Promise<number> {
        const query = `SELECT COUNT(*) FROM ${this.tableName}`;
        const result = await this.db.get<{ count: string }>(query);
        if (!result) {
            logger.warn(`No records found in ${this.tableName}`);
            return 0;
        }
        return parseInt(result.count, 10);
    }

    async findAll(): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableName}`;
        const results = await this.db.all<T>(query);
        if (!results || results.length === 0) {
            logger.warn(`No results found in ${this.tableName}`);
            return [];
        }
        return results;
    }

    async findById(id: number): Promise<T | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await this.db.get<T>(query, [id]);
        if (!result) {
            logger.warn(`No record found in ${this.tableName} with id ${id}`);
            return null;
        }
        return result;
    }

    async findByIdList(ids: number[]): Promise<T[]> {
        if (ids.length === 0) {
            logger.warn('Empty list of ids provided to findByIdList');
            return [];
        }
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
        const query = `SELECT * FROM ${this.tableName} WHERE id IN (${placeholders})`;
        const results = await this.db.all<T>(query, ids);
        if (!results || results.length === 0) {
            logger.warn(`No records found in ${this.tableName} with ids ${ids.join(', ')}`);
            return [];
        }
        return results;
    }

    async create(data: Partial<T>): Promise<number | null> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;
        const result = await this.db.get<{ id: number }>(query, values);
        if (!result) {
            logger.error(`Failed to insert into ${this.tableName}`);
            return null;
        }
        return result.id;
    }

    async update(id: number, data: Partial<T>): Promise<boolean> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1}`;
        const result = await this.db.run(query, [...values, id]);
        if (!result) {
            logger.error(`Failed to update ${this.tableName} with id ${id}`);
            return false;
        }
        return (result.rowCount ?? 0) > 0;
    }

    async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
        const result = await this.db.run(query, [id]);
        if (!result) {
            logger.error(`Failed to delete from ${this.tableName} with id ${id}`);
            return false;
        }
        return (result.rowCount ?? 0) > 0;
    }
}
