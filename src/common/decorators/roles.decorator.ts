import { SetMetadata } from "@nestjs/common";
import { Role } from "src/user/enum/role.enum";

export const ROLES_KEY = 'roles';

export const UseRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);