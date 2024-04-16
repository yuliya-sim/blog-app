import { TokenEntity } from '@entities/token.entity';

export interface Token {
    accessToken: string;
    refreshToken: TokenEntity;
}
