import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, InjectConfig } from 'nestjs-config';
@Injectable()
export class AuthGuard implements CanActivate {
    config: ConfigService;
    constructor(
        @InjectConfig() config: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.config = config;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verify(token);
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
