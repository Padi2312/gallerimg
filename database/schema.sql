-- `images` table stores the data of the images uploaded by the user. 
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    title TEXT,
    description TEXT,
    hash TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- `tags` stores the tags that are associated with the images. 
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT name_unique UNIQUE (name)
);
CREATE TABLE IF NOT EXISTS metadata (
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL,
    -- We'll store the EXIF data as JSONB in this column for now
    exif_data JSONB,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    CONSTRAINT image_id_unique UNIQUE (image_id)
);
-- `image_tags` stores the relationship between the images and the tags.
CREATE TABLE IF NOT EXISTS image_tags (
    image_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (image_id, tag_id)
);
-- `settings` stores the settings of the application.
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Insert the default settings if they don't already exist
INSERT INTO settings (key, value, type)
SELECT 'site_title',
    'Image Gallery',
    'string'
WHERE NOT EXISTS (
        SELECT 1
        FROM settings
        WHERE key = 'site_title'
    );
INSERT INTO settings (key, value, type)
SELECT 'index_images_on_upload',
    '1',
    'boolean'
WHERE NOT EXISTS (
        SELECT 1
        FROM settings
        WHERE key = 'index_images_on_upload'
    );