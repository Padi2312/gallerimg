// Images Repository
export interface ImageModel {
    id: number;
    filename: string;
    hash: string;
    title?: string;
    description?: string;
    download_count: number;
    created_at?: string;
}

// Tags Repository
export interface TagModel {
    id: number;
    name: string;
}

// Relation ImageTags Repository
export interface ImageTagModel {
    image_id: number;
    tag_id: number;
}

// Settings Repository
export interface SettingsModel {
    id: number;
    key: string;
    value: string;
    type?: string;
    updated_at?: string;
}

// Metadata Repository
export interface MetadataModel {
    id: number;
    image_id: number;
    exif_data: ExifReader.Tags;
}
