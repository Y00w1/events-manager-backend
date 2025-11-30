import { PartialType, PickType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(PickType(CreateUserDto, [
    'name',
    'phone',
    'documentNumber'
] as const)) {
    @Transform(({ value }) => value?.trim())
    name?: string;

    @Transform(({ value }) => value?.trim())
    phone?: string;
    
    @Transform(({ value }) => value?.trim())
    documentNumber?: string;
}