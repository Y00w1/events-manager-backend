import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCampusDto {

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    name: string;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsOptional()
    state?: string;

}
