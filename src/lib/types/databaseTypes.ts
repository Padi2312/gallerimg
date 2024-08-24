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
