import { folderImagesRepository, foldersRepository, imagesRepository, newslettersRepository } from "../core/database";
import { FoldersService } from "./folders-service";
import { MailService } from "./mail-service";

const mailService = new MailService(newslettersRepository);
const foldersService = new FoldersService(foldersRepository, folderImagesRepository, imagesRepository);
export {
    mailService,
    foldersService
};

