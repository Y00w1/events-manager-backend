import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UseRoles } from 'nest-access-control';
import { CreateUserDto, UserResponseDto, UpdateUserDto, GetUsersQueryDto, PaginatedUsersResponseDto } from '../dto';
import { Role } from '../enum/role.enum';
import { GetCurrentUserId } from 'src/common/decorators';
import { USER_API_ENTRY_POINT } from '../constant/user.constant';

@Controller(USER_API_ENTRY_POINT.BASE)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(USER_API_ENTRY_POINT.CREATE_ORGANIZER)
  @UseRoles({
    resource: 'user',
    action: 'create',
    possession: 'own',
  })
  async createUserOrganizer(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(
      createUserDto,
      Role.ORGANIZER,
  );
  }

  @Patch()
  async update(@GetCurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto):Promise<UserResponseDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto):Promise<UserResponseDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Patch(USER_API_ENTRY_POINT.PROMOTE_TO_ORGANIZER)
  async promoteToOrganizer(@Query('email') email: string): Promise<UserResponseDto> {
    return this.userService.updateToOrganizer(email);
  }

  @Get()
  @UseRoles({
    resource: 'user',
    action: 'read',
    possession: 'any',
  })
  async findAll(@Query() query: GetUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    return this.userService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
