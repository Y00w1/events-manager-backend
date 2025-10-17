import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Tokens } from './types';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { RefreshTokenGuard } from 'src/common/guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorators';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Public()
    @Post('local/signup')
    async signupLocal(@Body() signupDto: SignupDto): Promise<Tokens> {
        return this.authService.signupLocal(signupDto);
    }

    @Public()
    @Post('local/login')
    @HttpCode(HttpStatus.OK)
    async loginLocal(@Body() loginDto: LoginDto): Promise<Tokens> {
        return this.authService.loginLocal(loginDto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: string): Promise<boolean> {
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
        @GetCurrentUserId() userId: string, 
        @GetCurrentUser('refreshToken') refreshToken: string
    ): Promise<Tokens> {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
