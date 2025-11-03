import { Expose } from "class-transformer";
import { Role } from "../enum/role.enum";

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
}