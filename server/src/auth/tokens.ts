import { TokenEntity } from '../entities';

export interface Token {
    accessToken: string;
    refreshToken: TokenEntity;
}
