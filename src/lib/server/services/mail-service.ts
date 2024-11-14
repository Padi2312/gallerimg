import { env } from '$env/dynamic/private';
import * as nodemailer from 'nodemailer';
import type { NewslettersRepository } from '../core/database/repositories/NewslettersRepository';
import * as fs from 'fs/promises'

export class MailService {

  private newslettersRepository: NewslettersRepository;

  constructor(newslettersRepository: NewslettersRepository) {
    this.newslettersRepository = newslettersRepository;
  }

  public async sendMail(to: string, subject: string, html: string) {
    if (!process.env.MAIL_HOST || !process.env.MAIL_PORT || !process.env.MAIL_USER || !process.env.MAIL_PASS || !process
      .env.MAIL_FROM) {
      throw new Error('Mail settings are not configured');
    }

    const transporter = nodemailer.createTransport({
      host: env.MAIL_HOST!,
      port: Number(env.MAIL_PORT),
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS

      }
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
  }

  public async sendWelcomeMail(to: string) {
    const newsletterEntry = await this.newslettersRepository.findByEmail(to);
    if (!newsletterEntry) {
      throw new Error('Newsletter entry not found')
    }

    let welcomeHtml = await fs.readFile("templates/welcome.html", "utf-8")
    welcomeHtml = welcomeHtml.replace("{{unsubscribeLink}}", this.getUnsubscribeLink(newsletterEntry.id))
    await this.sendMail(to, "Welcome to Photo Parndt", welcomeHtml)
  }

  public async publishNewsLetter(subject: string, body: string) {
    const subscribers = await this.newslettersRepository.findAll();
    let infoHtml = await fs.readFile("templates/info.html", "utf-8")
    infoHtml = infoHtml.replace("{{content}}", body)


    for (const subscriber of subscribers) {
      infoHtml = infoHtml.replace("{{unsubscribeLink}}", this.getUnsubscribeLink(subscriber.id))
      await this.sendMail(subscriber.email, subject, infoHtml);
    }
  }

  getUnsubscribeLink(id: string) {
    return `https://photo.parndt.de/unsubscribe?id=${id}`
  }

}