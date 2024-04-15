import { TokenEntity } from '@entities/token.entity';

export interface Tokens {
    accessToken: string;
    refreshToken: TokenEntity;
}
