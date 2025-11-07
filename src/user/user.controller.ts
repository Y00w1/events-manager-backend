import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UseRoles } from 'nest-access-control';
import { CreateUserDto, UserResponseDto, UpdateUserDto } from './dto';
import { Role } from './enum/role.enum';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create/organizer')
  @UseRoles({
    resource: 'user',
    action: 'create',
    possession: 'own',
  })
  createUserOrganizer(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(
      createUserDto,
      Role.ORGANIZER,
  );
  }

  @Patch()
  update(@GetCurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto):Promise<UserResponseDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Patch('promote/organizer')
  promoteToOrganizer(@Query('email') email: string): Promise<UserResponseDto> {
    return this.userService.updateToOrganizer(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
