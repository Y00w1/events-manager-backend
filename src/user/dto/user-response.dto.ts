import { Expose } from "class-transformer";
import { Role } from "../enum/role.enum";
import { OrganizationArea } from "src/event/enum/organizationArea.enum";

export class UserResponseDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  name: string;
  @Expose()
  phone: string;
  @Expose()
  role: Role;
  @Expose()
  documentNumber: string;
  @Expose()
  organizationArea: OrganizationArea;
}