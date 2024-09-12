-- `images` table stores the data of the images uploaded by the user. 
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    title TEXT,
    description TEXT,
    hash TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- `tags` stores the tags that are associated with the images. 
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    CONSTRAINT name_unique UNIQUE (name)
);
-- `metadata` stores the metadata of the images.
CREATE TABLE IF NOT EXISTS metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID NOT NULL,
    date_time_original TIMESTAMP,
    model VARCHAR(255),
    f_number VARCHAR(12),
    exposure_time VARCHAR(12),
    iso INTEGER,
    focal_length VARCHAR(12),
    flash BOOLEAN,
    exposure_bias FLOAT,
    lens_model VARCHAR(255),
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    CONSTRAINT image_id_unique UNIQUE (image_id)
);
-- `image_tags` stores the relationship between the images and the tags.
CREATE TABLE IF NOT EXISTS image_tags (
    image_id UUID,
    tag_id UUID,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (image_id, tag_id)
);
-- `settings` stores the settings of the application.
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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