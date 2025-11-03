import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { BcryptAdapter } from 'src/common/crypto/bcrypt.adapter';
import { UserMapper } from 'src/common/mappers/user.mapper';

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
