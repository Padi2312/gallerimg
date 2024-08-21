import { env } from '$env/dynamic/private';
import { logger } from '$lib';
import { Database as SQLiteDatabase } from "bun:sqlite";
import * as fs from 'fs';
import * as path from 'path';


class Database {
    private db?: SQLiteDatabase;
    private dbPath: string;

    constructor(databasePath?: string) {
        try {
            if (!databasePath) {
                if (env.SQLITE_PATH)
                    databasePath = env.SQLITE_PATH
                else
                    databasePath = "data/db.sqlite";
            }
            this.dbPath = databasePath;
            logger.info('Database path:', this.dbPath);
        } catch (err) {
            logger.error('Failed to open database:', (err as Error).message);
            throw new Error('Failed to initialize database connection.');
        }
    }

    init() {
        // Create the directory if it doesn't exist
        fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
        this.db = new SQLiteDatabase(this.dbPath, { create: true });
        logger.debug('Connected to the SQLite database.');

        // Create the database with schema.sql
        const schema = fs.readFileSync("database/schema.sql", 'utf-8');
        this.db.exec(schema);
        logger.debug('Database schema initialized.');
    }

    run(query: string, params: Record<string, any> = {}) {
        if (!this.db) throw new Error('Database connection not initialized.');
        try {
            logger.debug('Executing query:', query, params);
            const stmt = this.db.query(query);
            return stmt.run(params);
        } catch (err) {
            logger.error('Error running query:', (err as Error).message);
            return undefined; // or handle error appropriately
        }
    }

    transaction<T>(cb: (db: Database) => T): T {
        if (!this.db) throw new Error('Database connection not initialized.');
        try {
            logger.debug('Starting transaction');
            const result = this.db.transaction(() => cb(this))();
            logger.debug('Transaction completed successfully');
            return result;
        } catch (err) {
            logger.error('Transaction failed:', (err as Error).message);
            throw err;
        }
    }

    get<T>(query: string, params: Record<string, any> = {}): T | undefined {
        if (!this.db) throw new Error('Database connection not initialized.');
        try {
            logger.debug('Executing query:', query, params);
            const stmt = this.db.query(query);
            return stmt.get(params) as T;
        } catch (err) {
            logger.error('Error executing query:', (err as Error).message);
            return undefined; // or handle error appropriately
        }
    }

    all<T>(query: string, params: Record<string, any> = {}): T[] | undefined {
        if (!this.db) throw new Error('Database connection not initialized.');
        try {
            logger.debug('Executing query:', query, params);
            const stmt = this.db.query(query);
            return stmt.all(params) as T[];
        } catch (err) {
            logger.error('Error executing query:', (err as Error).message);
            return undefined; // or handle error appropriately
        }
    }

    close(): void {
        if (!this.db) throw new Error('Database connection not initialized.');

        try {
            this.db.close();
            logger.debug('Database connection closed.');
        } catch (err) {
            logger.error('Error closing database:', (err as Error).message);
        }
    }
}

export default Database;
