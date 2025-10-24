import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCampusDto {

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    name: string;

}
