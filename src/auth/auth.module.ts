import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { BcryptAdapter } from 'src/common/crypto/bcrypt.adapter';
import { UserMapper } from 'src/common/mappers/user.mapper';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [JwtModule.register({}),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AccessTokenStrategy, 
    RefreshTokenStrategy,
    BcryptAdapter,
    UserMapper
  ]
})
export class AuthModule {}
