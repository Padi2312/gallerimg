import { env } from '$env/dynamic/private';
import { logger } from '$lib';
import * as fs from 'node:fs';
import * as path from 'node:path';
import pg from 'pg';

class Database {
    private pool: pg.Pool;
    private dbPath = "data/database"

    constructor() {
        try {
            this.pool = new pg.Pool({
                connectionString: env.DATABASE_URL,
            });
            logger.info('Database connection pool created');
        } catch (err) {
            logger.error('Failed to create database pool:', (err as Error).message);
            throw new Error('Failed to initialize database connection.');
        }
    }

    async init() {
        try {
            const client = await this.pool.connect();
            fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });

            const schema = fs.readFileSync("database/schema.sql", 'utf-8');
            await client.query(schema);
            logger.debug('Database schema initialized.');

            client.release();
            logger.debug('Connected to the PostgreSQL database.');
        } catch (err) {
            logger.error('Failed to connect to the database:', (err as Error).message);
            throw new Error('Failed to connect to the database.');
        }
    }

    async run(query: string, params: unknown[] = []) {
        try {
            logger.debug('Executing query:', query, params);
            const result = await this.pool.query(query, params);
            return result;
        } catch (err) {
            logger.error('Error running query:', (err as Error).message);
            throw err;
        }
    }

    async transaction<T>(cb: (client: pg.PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            logger.debug('Starting transaction');
            await client.query('BEGIN');
            const result = await cb(client);
            await client.query('COMMIT');
            logger.debug('Transaction completed successfully');
            return result;
        } catch (err) {
            await client.query('ROLLBACK');
            logger.error('Transaction failed:', (err as Error).message);
            throw err;
        } finally {
            client.release();
        }
    }

    async get<T>(query: string, params: unknown[] = []): Promise<T | undefined> {
        try {
            logger.debug('Executing query:', query, params);
            const result = await this.pool.query(query, params);
            return result.rows[0] as T;
        } catch (err) {
            logger.error('Error executing query:', (err as Error).message);
            throw err;
        }
    }

    async all<T>(query: string, params: unknown[] = []): Promise<T[]> {
        try {
            logger.debug('Executing query:', query, params);
            const result = await this.pool.query(query, params);
            return result.rows as T[];
        } catch (err) {
            logger.error('Error executing query:', (err as Error).message);
            throw err;
        }
    }

    async close(): Promise<void> {
        try {
            await this.pool.end();
            logger.debug('Database connection pool closed.');
        } catch (err) {
            logger.error('Error closing database pool:', (err as Error).message);
        }
    }
}

export default Database;
