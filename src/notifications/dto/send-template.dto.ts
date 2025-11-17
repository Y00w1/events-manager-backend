export class SendTemplateDto{
    to: string;
    templateId: string;
    dynamicData: Record<string, any>;
}