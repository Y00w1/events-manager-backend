import { IsBoolean, IsOptional, IsUUID } from "class-validator";

export class CreateEnrollmentDto {
    @IsUUID()
    eventId: string;

    @IsOptional()
    @IsBoolean()
    acceptWaitlist?: boolean;
}
