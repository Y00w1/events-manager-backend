import { IsOptional, IsInt, Min, IsIn, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../enum/role.enum';
import * as userConstant from '../constant/user.constant';

export class GetUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsIn(userConstant.ALLOWED_USER_SORT_FIELDS)
  sortBy?: userConstant.UserSortField = userConstant.USER_SORT.CREATED_AT;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
