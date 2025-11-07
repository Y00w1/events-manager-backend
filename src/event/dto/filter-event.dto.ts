import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { OrganizationArea } from '../enum/organizationArea.enum';
import { Modality } from '../enum/modality.enum';

export class FilterEventDto {

    @IsOptional()
    @IsString()
    roomId?: string;

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    orderByCapacity?: 'ASC' | 'DESC';

    @IsOptional()
    @IsEnum(OrganizationArea)
    organizationArea?: OrganizationArea;

    @IsOptional()
    @IsEnum(Modality)
    modality?: Modality;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}
