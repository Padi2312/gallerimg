import type { FolderDto, ImageDto } from "$lib/shared/types";
import type { FolderModel, ImageModel } from "../types/database-types";


export const mapImageModelToDto = (image: ImageModel, tags?: string[]): ImageDto => {
    return {
        id: image.id,
        url: `/api/v1/files/${image.filename}`,
        title: image.filename,
        tags: tags ?? [],
        createdAt: image.created_at!,
        downloadCount: image.download_count
    };
}

export const mapFolderModelToDto = (folder: FolderModel, images: ImageDto[]): FolderDto => {
    return {
        id: folder.id,
        name: folder.name,
        children: [],
        images
    };
}