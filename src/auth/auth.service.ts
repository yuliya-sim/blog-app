import { Injectable, BadRequestException, Body, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from './../user';
import { UserEntity } from './../entities';
import { JwtPayload } from './interfaces';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto';
import { compareSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { addMonths } from 'date-fns';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from '../entities/token.entity';
import { Tokens } from './tokens';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
    ) { }

    /**
     * A function that validates a user.
     *
     * @param {JwtPayload} payload - the payload containing user information
     * @return {Promise<UserEntity | null>} the user entity if found, otherwise null
     */
    async validateUser(payload: JwtPayload): Promise<UserEntity | null> {
        return await this.userService.findById(payload.id);
    }

    /**
     * Registers a new user.
     *
     * @param {RegisterDto} user - The user registration data.
     * @return {Promise<string>} - A promise that resolves to the JWT token.
     */
    async register(@Body() user: RegisterDto): Promise<string> {
        const existingUser = await this.userService.findByEmail(user.email);
        if (existingUser) {
            this.logger.warn('User already exists');
            throw new BadRequestException('User already exists');
        }
        const createdUser = await this.userService.create(user);
        const payload = { id: createdUser.id };
        return this.jwtService.signAsync(payload);
    }

    /**
     * Authenticates a user by their email and password and generates tokens for them.
     *
     * @param {LoginDto} loginDto - An object containing the user's email and password.
     * @param {string} agent - The user agent string.
     * @return {Promise<any>} - A promise that resolves to the generated tokens.
     */
    async login({ email, password }: LoginDto, agent: string): Promise<any> {
        const foundUser = await this.userService.findByCredentials(email, password);

        if (!foundUser || !compareSync(password, foundUser.password)) {
            this.logger.warn('Invalid credentials');
            throw new BadRequestException('Invalid credentials');
        }

        return this.generateTokens(foundUser, agent);
    }

    /**
     * Async function to retrieve or create a refresh token for a user.
     *
     * @param {string} userId - The ID of the user
     * @param {string} agent - The user agent
     * @return {Promise<any>} A Promise that resolves with the retrieved or created token
     */
    async getRefreshToken(userId: string, agent: string): Promise<any> {
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
    }
    /**
     * Refreshes the access tokens for a user.
     *
     * @param {string} refreshToken - The refresh token to be used.
     * @param {string} agent - The agent associated with the user.
     * @return {Promise<any>} A promise that resolves to the generated tokens.
     */
    async refreshTokens(refreshToken: string, agent: string): Promise<any> {
        // Find the token with the provided refresh token
        const token = await this.tokenRepository.findOne({
            where: { token: refreshToken },
        });

        // Check if the token doesn't exist or has expired
        if (!token || token.exp < new Date()) {
            // Delete the token
            await this.tokenRepository.remove(token);
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Find the user associated with the token
        const user = await this.userService.findById(token.userId);

        // Generate new tokens for the user
        return this.generateTokens(user, agent);
    }
    /**
     * Find a token by its value.
     *
     * @param {string} token - The token value to search for.
     * @return {Promise<TokenEntity | null>} The found token entity or null if not found.
     */
    async findToken(token: string): Promise<TokenEntity | null> {
        return await this.tokenRepository.findOne({
            where: {
                token,
            },
        });
    }
    /**
     * Generates access and refresh tokens for a given user and agent.
     *
     * @param {UserEntity} user - The user entity for whom the tokens are being generated.
     * @param {string} agent - The agent for which the tokens are being generated.
     * @return {Promise<Tokens>} A promise that resolves to an object containing the access and refresh tokens.
     */
    async generateTokens(user: UserEntity, agent: string): Promise<Tokens> {
        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            roles: user.role,
        });
        const refreshToken = await this.getRefreshToken(user.id, agent);
        return { accessToken, refreshToken };
    }

    /**
     * Deletes a refresh token from the database.
     *
     * @param {string} id - The ID of the refresh token to be deleted.
     * @return {Promise<void>} - A promise that resolves when the token is successfully deleted.
     */
    async deleteRefreshToken(id: string) {
        // Find the token by its ID
        const token = await this.tokenRepository.createQueryBuilder('token').where('token.id = :id', { id }).getOne();

        // Check if the token exists
        if (!token) {
            // Throw an error or handle the case where the token doesn't exist
            throw new Error('Token not found');
        }

        // Remove the token from the database
        await this.tokenRepository.remove(token);
    }
}
