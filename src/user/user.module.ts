import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptAdapter } from 'src/common/crypto/bcrypt.adapter';
import { UserMapper } from 'src/common/mappers/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    BcryptAdapter,
    UserMapper,
  ],
  exports: [UserService],
})
export class UserModule {}
