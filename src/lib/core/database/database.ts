import { env } from '$env/dynamic/private';
import { logger } from '$lib';
import type { RunResult, Database as SQLiteDatabase, Transaction } from 'better-sqlite3';
import SQLite from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
//@ts-ignore
import sqlSchema from './schema.sql';

class Database {
    private db: SQLiteDatabase;
    private dbPath: string;
    constructor(databasePath?: string) {
        try {
            if (!databasePath) {
                databasePath = env.SQLITE_PATH ?? 'database/db.sqlite';
            }
            this.dbPath = databasePath;
            this.db = new SQLite(this.dbPath);
            logger.debug('Connected to the SQLite database.');
        } catch (err) {
            logger.error('Failed to open database:', (err as Error).message);
            throw new Error('Failed to initialize database connection.');
        }
    }

    init() {
        // Create the directory if it doesn't exist
        fs.mkdirSync(path.dirname(this.dbPath), { recursive: true })

        // Create the database with schema.sql
        const schemaPath = path.join(process.cwd(), sqlSchema);
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        const result = this.db.exec(schema)
        if (!result) {
            throw new Error('Failed to initialize database schema.');
        }
    }

    run(query: string, params: any[] = []): RunResult | undefined {
        try {
            logger.debug('Executing query:', query, params);
            const stmt = this.db.prepare(query);
            return stmt.run(...params);
        } catch (err) {
            logger.error('Error running query:', (err as Error).message);
            return undefined; // or handle error appropriately
        }
    }
    transaction<T>(cb: (db: Database) => T): T {
        const txFunction = this.db.transaction((sqliteDb: SQLiteDatabase) => {
            return cb(this);
        });
        try {
            logger.debug('Starting transaction');
            const result = txFunction(this.db);
            logger.debug('Transaction completed successfully');
            return result;
        } catch (err) {
            logger.error('Transaction failed:', (err as Error).message);
            throw err;
        }
    }


    get<T>(query: string, params: any[] = []): T | undefined {
        try {
            logger.debug('Executing query:', query, params);
            const stmt = this.db.prepare(query);
            return stmt.get(...params) as T;
        } catch (err) {
            logger.error('Error executing query:', (err as Error).message);
            return undefined; // or handle error appropriately
        }
    }

    all<T>(query: string, params: any[] = []): T[] | undefined {
        try {
            logger.debug('Executing query:', query, params);
            const stmt = this.db.prepare(query);
            return stmt.all(...params) as T[];
        } catch (err) {
            logger.error('Error executing query:', (err as Error).message);
            return undefined; // or handle error appropriately
        }
    }

    close(): void {
        try {
            this.db.close();
            logger.debug('Database connection closed.');
        } catch (err) {
            logger.error('Error closing database:', (err as Error).message);
        }
    }
}

export default Database;
