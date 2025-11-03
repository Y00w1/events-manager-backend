import { RolesBuilder } from "nest-access-control"
import { Role } from "src/user/enum/role.enum";

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

RBAC_POLICY
    .grant(Role.USER)
        .readOwn('user')
    .grant(Role.ORGANIZER)
        .extend(Role.USER)
    .grant(Role.ADMIN)
        .extend(Role.ORGANIZER)
        .createAny('user');
