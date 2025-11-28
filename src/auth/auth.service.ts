import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/service/user.service';
import { Tokens } from './types';
import { Role } from 'src/user/enum/role.enum';
import { LoginDto, SignupDto } from './dto';
import { BcryptAdapter } from 'src/common/crypto/bcrypt.adapter';
import { UserResponseDto } from 'src/user/dto';
import { UserMapper } from 'src/common/mappers/user.mapper';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly bcryptAdapter: BcryptAdapter,
        private readonly userMapper: UserMapper,
    ) { }

    async signupLocal(signupDto: SignupDto): Promise<Tokens> {
        const user = await this.userService.create({
            ...signupDto,
        }, Role.USER);
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async loginLocal(loginDto: LoginDto): Promise<Tokens> {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user) throw new BadRequestException('Invalid credentials');

        const passwordMatches = await this.bcryptAdapter.compare(loginDto.password, user.password);
        if (!passwordMatches) throw new BadRequestException('Invalid credentials');

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: string) {
        const user = await this.userService.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new BadRequestException('Invalid user or already logged out');
        }
        await this.userService.updateToken(userId, null);
        return { message: 'Logout successful' };
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
        const user = await this.userService.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Invalid user or no refresh token found');
        }
        const refreshTokenMatches = await this.bcryptAdapter.compare(refreshToken, user.hashedRefreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Invalid refresh token');

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = refreshToken
            ? await this.bcryptAdapter.hash(refreshToken)
            : null;
        await this.userService.updateToken(userId, hashedRefreshToken);
    }

    private async getTokens(userId: string, email: string, role: Role): Promise<Tokens> {
        const payload = { sub: userId, email, role };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                payload,
                { secret: process.env.AT_SECRET, expiresIn: '15m' },
            ),
            this.jwtService.signAsync(
                payload,
                { secret: process.env.RT_SECRET, expiresIn: '7d' },
            ),
        ]);
        return { accessToken: accessToken, refreshToken: refreshToken };
    }

    async getMe(userId: string): Promise<UserResponseDto> {
        const user = await this.userService.findById(userId);
        if (!user) throw new BadRequestException('User not found');
        const userResponse: UserResponseDto = await this.userMapper.toResponseDto(user);
        return userResponse;
    }
}
