import { IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional, IsNumber, Min, IsDateString, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OrganizationArea } from '../enum/organizationArea.enum';
import { Modality } from '../enum/modality.enum';

export class CreateEventDto {

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    @IsNotEmpty()
    initialDate: Date;

    @IsDateString()
    @IsNotEmpty()
    finalDate: Date;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsOptional()
    beginHour?: string;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsOptional()
    endHour?: string;

    @IsEnum(Modality)
    @IsNotEmpty()
    modality: Modality;

    // roomId es obligatorio solo si la modalidad NO es Virtual
    @ValidateIf(o => o.modality !== Modality.VIRTUAL)
    @IsUUID()
    @IsNotEmpty()
    @ValidateIf(o => o.modality === Modality.VIRTUAL)
    @IsUUID()
    @IsOptional()
    roomId?: string;

    @IsEnum(OrganizationArea)
    @IsNotEmpty()
    organizationArea: OrganizationArea;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    description: string;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsOptional()
    state?: string;

    @IsUUID()
    @IsOptional()
    responsiblePersonId?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    maxAttendees: number;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    urlImage: string;
}
