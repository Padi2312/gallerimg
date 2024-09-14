export interface ImageDto {
    id: string;
    url: string;
    title: string;
    tags: string[];
    createdAt: string;
    downloadCount: number;
}

export interface ExifData {
    date_time_original?: string;  // ISO 8601 format timestamp
    model?: string; // Model
    f_number?: string;
    exposure_time?: string;
    iso?: number;
    focal_length?: string;
    flash?: boolean;
    exposure_bias?: number;
    lens_model?: string;
}

export interface FolderDto {
    id: string;
    name: string;
    parent_id?: string;
    children: FolderDto[];
    images: ImageDto[];
}