import { PartialType, PickType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { CreateUserDto } from "./create-user.dto";
import { OrganizationArea } from "src/event/enum/organizationArea.enum";

export class UpdateUserDto extends PartialType(PickType(CreateUserDto, [
    'name',
    'phone',
    'documentNumber',
    'organizationArea',
] as const)) {
    @Transform(({ value }) => value?.trim())
    name?: string;

    @Transform(({ value }) => value?.trim())
    phone?: string;
    
    @Transform(({ value }) => value?.trim())
    documentNumber?: string;

    organizationArea?: OrganizationArea;
}