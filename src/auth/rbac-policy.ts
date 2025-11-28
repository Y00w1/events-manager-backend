import { RolesBuilder } from "nest-access-control"
import { Role } from "src/user/enum/role.enum";

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

RBAC_POLICY
    .grant(Role.USER)
        .readOwn('user')
        .readOwn('enrollment')
        .createOwn('enrollment')
        .deleteOwn('enrollment')
    .grant(Role.ORGANIZER)
        .extend(Role.USER)
        .readAny('enrollment')
    .grant(Role.ADMIN)
        .extend(Role.ORGANIZER)
        .createAny('user')
        .readAny('user');
