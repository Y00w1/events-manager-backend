import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMailImport from '@sendgrid/mail';
import { SendTemplateDto } from '../dto/send-template.dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    constructor(private configService:ConfigService){
        const sgMail = (sgMailImport as any)?.default ?? sgMailImport;
        if (typeof sgMail?.setApiKey !== 'function') {
            this.logger.error('SendGrid client not available or has unexpected shape');
        } else {
            sgMail.setApiKey(this.configService.getOrThrow('SENDGRID_API_KEY'));
        }
    }

    async sendTemplateEmail(dto: SendTemplateDto): Promise<void>{
        const msg = {
            to: dto.to,
            from: this.configService.getOrThrow('SENDGRID_FROM_EMAIL'),
            templateId: dto.templateId,
            dynamicTemplateData: dto.dynamicData,
        };

        try{
            const sg = (sgMailImport as any)?.default ?? sgMailImport;
            await sg.send(msg);
            this.logger.log(`Template email sent to ${dto.to} using template ${dto.templateId}`);
        }catch(error){
            this.logger.error(`Failed to send template email to ${dto.to}: ${error?.message ?? JSON.stringify(error)}`);
        }
    }

    async sendEmail(to: string, subject: string, html: string, text?: string): Promise<void> {
        const msg = {
            to, 
            from: this.configService.getOrThrow('SENDGRID_FROM_EMAIL'),
            subject,
            html,
            text
        };
        try {
            const sg = (sgMailImport as any)?.default ?? sgMailImport;
            await sg.send(msg);
            this.logger.log(`Email sent to ${to} with subject: ${subject}`);
        }catch(error){
            this.logger.error(`Failed to send email to ${to}: ${error?.message ?? JSON.stringify(error)}`);
        }
    }
}
