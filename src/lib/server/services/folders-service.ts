import type { FolderDto, ImageDto } from "$lib/shared/types";
import type { FolderImagesRepository } from "../core/database/repositories/FolderImageRepository";
import type { FoldersRepository } from "../core/database/repositories/FoldersRepository";
import type { ImagesRepository } from "../core/database/repositories/ImagesRepository";
import { mapFolderModelToDto, mapImageModelToDto } from "../utils/utils";

export class FoldersService {
    constructor(
        private foldersRepository: FoldersRepository,
        private folderImagesRepository: FolderImagesRepository,
        private imagesRepository: ImagesRepository
    ) {

    }

    async getRootFolders(): Promise<FolderDto[]> {
        const folders = await this.foldersRepository.findAllBy("parent_folder_id", null);
        const foldersWithImages: FolderDto[] = [];

        for (const folder of folders) {
            const imagesInFolder = await this.folderImagesRepository.findAllBy("folder_id", folder.id);
            const images: ImageDto[] = [];
            for (const imageInFolder of imagesInFolder) {
                const image = await this.imagesRepository.findById(imageInFolder.image_id);
                if (!image) continue;
                images.push(mapImageModelToDto(image))
            }
            const folderDto = mapFolderModelToDto(folder, images);
            foldersWithImages.push(folderDto);
        }
        return foldersWithImages;
    }

    async getFoldersWithImages(): Promise<FolderDto[]> {
        const folders = await this.foldersRepository.findAll();
        const foldersWithImages: FolderDto[] = [];

        for (const folder of folders) {
            const imagesInFolder = await this.folderImagesRepository.findAllBy("folder_id", folder.id);
            const images: ImageDto[] = [];
            for (const imageInFolder of imagesInFolder) {
                const image = await this.imagesRepository.findById(imageInFolder.image_id);
                if (!image) continue;
                images.push(mapImageModelToDto(image))
            }
            const folderDto = mapFolderModelToDto(folder, images);
            foldersWithImages.push(folderDto);
        }
        return foldersWithImages;
    }

    async deleteImageInFolder(folderId: string, imageId: string) {
        return this.folderImagesRepository.deleteImageInFolder(folderId, imageId);
    }

    async getFolderWithImagesById(id: string): Promise<FolderDto | null> {
        const folder = await this.foldersRepository.findById(id);
        if (!folder) return null;

        const imagesInFolder = await this.folderImagesRepository.findAllBy("folder_id", folder.id);

        const images: ImageDto[] = [];
        for (const imageInFolder of imagesInFolder) {
            const image = await this.imagesRepository.findById(imageInFolder.image_id);
            if (!image) continue;
            images.push(mapImageModelToDto(image));
        }

        return mapFolderModelToDto(folder, images);
    }

    async addImagesToFolder(folderId: string, imageIds: string[]): Promise<void> {
        for (const imageId of imageIds) {
            await this.folderImagesRepository.create({ folder_id: folderId, image_id: imageId });
        }
    }
}