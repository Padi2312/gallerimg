import { newslettersRepository } from "../core/database";
import { MailService } from "./mail-service";

const mailService = new MailService(newslettersRepository);

export {
    mailService
}
