import { readFileSync } from 'fs';
import { join } from 'path';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  sendEmail(to: string, subject: string, template: string, context: any) {
    const templatePath = this.getTemplatePath(template);
    const templateContent = readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateContent);
    const html = compiledTemplate(context);

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject,
      html,
    };

    this.transporter.sendMail(mailOptions);
  }

  private getTemplatePath(template: string): string {
    return join(process.cwd(), 'src/email/templates', `${template}.hbs`);
  }
}
