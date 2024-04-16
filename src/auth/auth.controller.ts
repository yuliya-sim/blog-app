import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    Res,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { Response } from 'express';
import { InjectConfig } from 'nestjs-config';

import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Cookie, Public, UserAgent } from '../../libs/shared/src/decorators';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { TokenEntity } from '../entities';
const REFRESH_TOKEN = 'refreshtoken';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly authService: AuthService,
        @InjectConfig() private readonly config,
    ) {
        this.config = config;
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    @ApiResponse({ status: 201, description: 'User created.' })
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async register(@Body() userModel: RegisterDto) {
        return this.authService.register(userModel);
    }

    @Post('login')
    @ApiResponse({ status: 200, description: 'User logged in.' })
    @ApiOperation({ summary: 'Login a user' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async login(
        @Body() dto: LoginDto,
        @Res() res: Response,
        @UserAgent() agent: string,
    ): Promise<{ accessToken: string }> {
        try {
            return await this.authService.login(dto, agent, res);
        } catch (error) {
            this.logger.error(`Failed to login user. Error: ${error.message}`, error.stack);
            throw error;
        }
    }

    @ApiResponse({ status: 200, description: 'User refreshed tokens.' })
    @ApiOperation({ summary: 'Refresh tokens' })
    @ApiBadRequestResponse({ description: 'Invalid refresh token' })
    @Get('refresh-tokens')
    async refreshTokens(
        @Cookie(REFRESH_TOKEN) refreshToken: TokenEntity,
        @Res() res: Response,
        @UserAgent() agent: string,
    ) {
        try {
            await this.authService.refreshTokens(refreshToken.token, agent, res);
        } catch (error) {
            this.logger.error(`Failed to refresh tokens. Error: ${error.message}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    @Get('logout')
    @ApiResponse({ status: 200, description: 'User logged out.' })
    @ApiOperation({ summary: 'Logout a user' })
    @ApiBadRequestResponse({ description: 'Invalid refresh token' })
    async logout(@Cookie(REFRESH_TOKEN) refreshToken: TokenEntity, @Res() res: Response) {
        try {
            await this.authService.deleteRefreshToken(refreshToken, res);
        } catch (error) {
            this.logger.error(`Failed to logout user. Error: ${error.message}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
