import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { Tokens } from './types';
import { Role } from 'src/user/enum/role.enum';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, 
        private readonly jwtService: JwtService) {}

    async signupLocal(signupDto: SignupDto): Promise<Tokens> {
        const existingUser = await this.userService.findByEmail(signupDto.email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        const hashedPassword = await this.hashData(signupDto.password);
        const user = await this.userService.create({
            ...signupDto,
            password: hashedPassword,
        });
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async loginLocal(loginDto: LoginDto): Promise<Tokens> {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user) throw new BadRequestException('Invalid credentials');

        const passwordMatches = await this.verifyPassword(loginDto.password, user.password);
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
        await this.userService.update(userId, { hashedRefreshToken: null });
        return true;
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
        const user = await this.userService.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Invalid user or no refresh token found');
        }
        const refreshTokenMatches = await this.verifyPassword(refreshToken, user.hashedRefreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Invalid refresh token');

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userService.update(userId, { hashedRefreshToken });
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

    private async hashData(data: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(data, salt);
    }

    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
