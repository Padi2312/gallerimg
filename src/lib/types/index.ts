export type ImageItem = {
    id: string;
    url: string;
    title: string;
    tags: string[];
    uploadDate: string;
};

export interface Image {
    title?: string;
    description?: string;
    tags?: string[];
}

export interface ImageDto {
    id: string;
    url: string;
    title: string;
    tags: string[];
    createdAt: string;
}