import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsUUID, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateRoomDto {

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    type: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    capacity: number;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsOptional()
    state?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    equipment?: string[];

    @IsUUID()
    @IsNotEmpty()
    campusId: string;
}
