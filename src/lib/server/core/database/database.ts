/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from '$env/dynamic/private';
import { logger } from '$lib';
import { Database as SQLiteDatabase } from "bun:sqlite";
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

    private async migrate() {
        const SQLITE_PATH = env.SQLITE_PATH || 'data/db.sqlite';
        const DATABASE_URL = env.DATABASE_URL;

        const pgClient = new pg.Client({
            connectionString: DATABASE_URL,
        });
        const sqliteDb = new SQLiteDatabase(SQLITE_PATH);
        try {
            await pgClient.connect();

            // Read and execute schema.sql to create tables in PostgreSQL
            const schemaPath = 'database/schema.sql';
            const schema = fs.readFileSync(schemaPath, 'utf-8');
            await pgClient.query(schema);

            // Migrate images
            const images = sqliteDb.prepare('SELECT * FROM images').all();
            for (const _image of images) {
                const image: any = _image;
                try {
                    await pgClient.query(
                        'INSERT INTO images (id, filename, title, description, hash, download_count, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                        [image.id, image.filename, image.title, image.description, image.hash, image.download_count, image.created_at]
                    );
                } catch (error) {
                    console.error('Failed to migrate image:', image, error);
                }
            }

            // Migrate tags
            const tags = sqliteDb.prepare('SELECT * FROM tags').all();
            for (const _tag of tags) {
                const tag: any = _tag;
                try {
                    await pgClient.query(
                        'INSERT INTO tags (id, name) VALUES ($1, $2)',
                        [tag.id, tag.name]
                    );
                } catch (error) {
                    console.error('Failed to migrate tag:', tag, error);

                }

            }

            // // Migrate metadata
            // const metadata = sqliteDb.prepare('SELECT * FROM metadata').all();
            // for (const meta of metadata) {
            //     await pgClient.query(
            //         'INSERT INTO metadata (id, image_id, key, value) VALUES ($1, $2, $3, $4)',
            //         [meta.id, meta.image_id, meta.key, meta.value]
            //     );
            // }

            // Migrate image_tags
            const imageTags = sqliteDb.prepare('SELECT * FROM image_tags').all();
            for (const _imageTag of imageTags) {
                const imageTag: any = _imageTag;
                await pgClient.query(
                    'INSERT INTO image_tags (image_id, tag_id) VALUES ($1, $2)',
                    [imageTag.image_id, imageTag.tag_id]
                );
            }

            console.log('Migration completed successfully.');
        } catch (error) {
            console.error('Migration failed:', error);
        } finally {
            await pgClient.end();
            sqliteDb.close();
        }
    }



    async init() {
        try {
            await this.migrate()
        } catch (error) {
            logger.error('Failed to migrate database:', (error as Error).message);
        }

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
