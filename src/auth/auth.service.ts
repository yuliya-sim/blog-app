import { Injectable, BadRequestException, Body, Logger, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { InjectConfig } from 'nestjs-config';
import { compareSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addMonths } from 'date-fns';
import { Repository } from 'typeorm';

import { UserService } from './../user';
import { UserEntity } from './../entities';
import { TokenEntity } from '../entities/token.entity';
import { JwtPayload } from './interfaces';
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { Token } from './tokens';

const REFRESH_TOKEN = 'refreshtoken';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
        @InjectConfig() private readonly config,
    ) {
        this.config = config;
    }

    async validateUser(payload: JwtPayload): Promise<UserEntity | null> {
        try {
            return await this.userService.findById(payload.id);
        } catch (error) {
            this.logger.error(`Error validating user ${payload.id}`, error);
            throw new Error();
        }
    }

    async register(@Body() user: RegisterDto): Promise<string> {
        try {
            const existingUser = await this.userService.findByEmail(user.email);
            if (existingUser) {
                this.logger.warn('User already exists');
                throw new BadRequestException('User already exists');
            }
            const createdUser = await this.userService.create(user);
            const payload = { id: createdUser.id };
            return await this.jwtService.signAsync(payload);
        } catch (error) {
            this.logger.error('Error during user registration', error);
            throw new Error();
        }
    }

    async login({ email, password }: LoginDto, agent: string, res: Response): Promise<any> {
        try {
            const foundUser = await this.userService.findByCredentials(email, password);

            if (!foundUser || !compareSync(password, foundUser.password)) {
                this.logger.warn('Invalid credentials');
                throw new BadRequestException('Invalid credentials');
            }
            const tokens = await this.generateTokens(foundUser, agent);
            if (!tokens) {
                throw new BadRequestException('Invalid credentials');
            }
            return this.setRefreshTokenToCookies(tokens, res);
        } catch (error) {
            this.logger.error('Error during authentication', error);
            throw new Error();
        }
    }

    async getRefreshToken(userId: string, agent: string): Promise<any> {
        try {
            const token = await this.tokenRepository
                .createQueryBuilder('token')
                .where('token.userId = :userId', { userId })
                .andWhere('token.userAgent = :agent', { agent })
                .getOne();

            if (token) {
                token.token = uuidv4();
                token.exp = addMonths(new Date(), 1);

                return await this.tokenRepository.save(token);
            } else {
                const newToken = new TokenEntity();
                newToken.token = uuidv4();
                newToken.exp = addMonths(new Date(), 1);
                newToken.userId = userId;
                newToken.userAgent = agent;
                const createdToken = await this.tokenRepository.save(newToken);

                return createdToken;
            }
        } catch (error) {
            this.logger.error('Error during getRefreshToken', error);
            throw new Error();
        }
    }

    async refreshTokens(refreshToken: string, agent: string, res: Response): Promise<any> {
        try {
            if (!refreshToken) {
                throw new UnauthorizedException();
            }

            const token = await this.tokenRepository.findOne({
                where: { token: refreshToken },
            });

            if (!token || token.exp < new Date()) {
                await this.tokenRepository.remove(token);
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            const user = await this.userService.findById(token.userId);

            const tokens = await this.generateTokens(user, agent);
            if (!tokens) {
                throw new UnauthorizedException();
            }
            return this.setRefreshTokenToCookies(tokens, res);
        } catch (error) {
            this.logger.error('Error during refreshTokens', error);
            throw new Error();
        }
    }

    async findToken(token: string): Promise<TokenEntity | null> {
        try {
            return await this.tokenRepository.findOne({
                where: {
                    token,
                },
            });
        } catch (error) {
            this.logger.error('Error during findToken', error);
            throw new Error();
        }
    }

    async generateTokens(user: UserEntity, agent: string): Promise<Token> {
        try {
            const accessToken = this.jwtService.sign({
                id: user.id,
                email: user.email,
                roles: user.role,
            });
            const refreshToken = await this.getRefreshToken(user.id, agent);
            return { accessToken, refreshToken };
        } catch (error) {
            this.logger.error('Error during generateTokens', error);
            throw new Error();
        }
    }

    async deleteRefreshToken(refreshToken: TokenEntity, res: any) {
        try {
            if (!refreshToken) {
                res.sendStatus(HttpStatus.OK);
                return;
            }

            const token = await this.tokenRepository
                .createQueryBuilder('token')
                .where('token.id = :id', { id: refreshToken.id })
                .getOne();

            if (!token) {
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            await this.tokenRepository.remove(token);
            res.cookie(REFRESH_TOKEN, '', {
                httpOnly: true,
                secure: true,
                expires: new Date(),
            });
            res.sendStatus(HttpStatus.OK);
        } catch (error) {
            this.logger.error('Error deleting refresh token', error);
            throw new Error();
        }
    }

    private setRefreshTokenToCookies(tokens: Token, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }
        res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.config.get('environment').NODE_ENV === 'PROD',
            path: '/',
        });

        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
    }
}
