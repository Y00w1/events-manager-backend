import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/user/enum/role.enum';

export class SignupDto {
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

    @IsEnum(Role, { message: `Role must be one of: ${Object.values(Role).join(', ')}` })
    role: Role;
}
