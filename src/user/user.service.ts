import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './enum/role.enum';
import { CreateUserDto, UserResponseDto, UpdateUserDto } from './dto';
import { BcryptAdapter } from 'src/common/crypto/bcrypt.adapter';
import { UserMapper } from 'src/common/mappers/user.mapper';
import { NotificationsService } from 'src/notifications/notifications.service';
import { SendTemplateDto } from 'src/notifications/dto/send-template.dto';
import { NOTIFICATION_TEMPLATES } from 'src/notifications/constants/notifications.constants';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly userMapper: UserMapper,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto, role: Role = Role.USER): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new NotFoundException('User with this email already exists');
    }
    const hashedPassword = await this.bcryptAdapter.hash(createUserDto.password);
    const user = this.userRepository.create({ 
      ...createUserDto, 
      role,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return this.userMapper.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) throw new NotFoundException('User not found');
    await this.userRepository.update(id, updateUserDto);
    return this.userMapper.toResponseDto(updatedUser);
  }

  async updateToOrganizer(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    user.role = Role.ORGANIZER;
    await this.userRepository.update(user.id, user);
    const templateData = new SendTemplateDto();
    templateData.to = user.email;
    templateData.templateId = NOTIFICATION_TEMPLATES.UPDATE_TO_ORGANIZER_NOTIFICATION;
    templateData.dynamicData = {
    };
    await this.notificationsService.sendtemplateEmail(templateData);
    return this.userMapper.toResponseDto(user);
  }

  async updateToken(id: string, hashedRefreshToken?: string | null) {
    await this.userRepository.update(id, { hashedRefreshToken });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.softRemove(user);
  }
}
