import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRt } from "../types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        const secret = config.get<string>('RT_SECRET');
        if (!secret) {
            throw new Error('RT_SECRET not found in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload): Promise<JwtPayloadWithRt> {
        const refreshToken = req?.get('Authorization')?.replace('Bearer', '').trim();
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        return { ...payload, refreshToken };
    }
}