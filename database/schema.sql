CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL,
    title TEXT,
    description TEXT,
    hash TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS image_tags (
    image_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (image_id) REFERENCES images(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id),
    PRIMARY KEY (image_id, tag_id)
);

-- Check if the column exists
PRAGMA table_info(images);

-- Add the column if it doesn't exist
BEGIN TRANSACTION;

-- Create a new table with the desired structure
CREATE TABLE IF NOT EXISTS images_new (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL,
    title TEXT,
    description TEXT,
    hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    download_count INTEGER DEFAULT 0
);

-- Copy data from the old table to the new one
INSERT INTO images_new (id, filename, title, description, hash, created_at)
SELECT id, filename, title, description, hash, created_at FROM images;

-- Drop the old table
DROP TABLE images;

-- Rename the new table to the original name
ALTER TABLE images_new RENAME TO images;

COMMIT;
