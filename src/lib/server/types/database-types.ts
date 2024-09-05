// Images Repository
export interface ImageModel {
    id: string;
    filename: string;
    hash: string;
    title?: string;
    description?: string;
    download_count: number;
    created_at?: string;
}

// Tags Repository
export interface TagModel {
    id: string;
    name: string;
}

// Relation ImageTags Repository
export interface ImageTagModel {
    image_id: string;
    tag_id: string;
}

// Settings Repository
export interface SettingsModel {
    id: string;
    key: string;
    value: string;
    type?: string;
    updated_at?: string;
}

// Metadata Repository
export interface MetadataModel {
    id: string;
    image_id: string;
    exif_data: ExifReader.Tags;
}

// Newsletters Repository
export interface NewsletterModel {
    id: string;
    email: string;
    created_at: string;
}