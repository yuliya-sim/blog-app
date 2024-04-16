import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@app/interfaces/jwt-payload.interface';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (key: keyof JwtPayload, ctx: ExecutionContext): JwtPayload | Partial<JwtPayload> => {
        const request = ctx.switchToHttp().getRequest();
        return key ? request?.user[key] : request?.user;
    },
);
