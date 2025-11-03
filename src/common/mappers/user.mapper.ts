import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "src/user/dto";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class UserMapper {
    async toResponseDto(user: User): Promise<UserResponseDto> {
        return plainToInstance(
            UserResponseDto, 
            user, 
            { 
                excludeExtraneousValues: true 
            });
    }
    async toResponseDtoList(users: User[]): Promise<UserResponseDto[]> {
    return Promise.all(users.map(user => this.toResponseDto(user)));
  }
}