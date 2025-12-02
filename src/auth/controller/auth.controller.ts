import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { RefreshTokenGuard } from 'src/common/guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorators';
import { UserResponseDto } from 'src/user/dto';
import { AuthService } from '../service/auth.service';
import { SignupDto, LoginDto } from '../dto';
import { Tokens } from '../types';
import { AUTH_API_ENTRY_POINT } from '../constant/auth.constant';

@Controller(AUTH_API_ENTRY_POINT.BASE)
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Public()
    @Post(AUTH_API_ENTRY_POINT.SIGNUP)
    async signupLocal(@Body() signupDto: SignupDto): Promise<Tokens> {
        return this.authService.signupLocal(signupDto);
    }

    @Public()
    @Post(AUTH_API_ENTRY_POINT.LOGIN)
    @HttpCode(HttpStatus.OK)
    async loginLocal(@Body() loginDto: LoginDto): Promise<Tokens> {
        return this.authService.loginLocal(loginDto);
    }

    @Post(AUTH_API_ENTRY_POINT.LOGOUT)
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: string) {
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post(AUTH_API_ENTRY_POINT.REFRESH_TOKEN)
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
        @GetCurrentUserId() userId: string, 
        @GetCurrentUser('refreshToken') refreshToken: string
    ): Promise<Tokens> {
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Get(AUTH_API_ENTRY_POINT.ME)
    async getMe(@GetCurrentUserId() userId: string) : Promise<UserResponseDto>{
        return this.authService.getMe(userId);
    }
}
