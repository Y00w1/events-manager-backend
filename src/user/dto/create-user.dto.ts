import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { OrganizationArea } from 'src/event/enum/organizationArea.enum';

export class CreateUserDto {
    @Transform(({ value }) => value?.trim())
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    name: string;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    phone: string;

    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    documentNumber: string;
}
