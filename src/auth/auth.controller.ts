import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Get,
  BadRequestException,
  UnauthorizedException,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response } from 'express';
import { InjectConfig } from 'nestjs-config';

import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Cookie, Public, UserAgent } from '../../libs/shared/src/decorators';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './tokens';
import { TokenEntity } from '../entities';
import { AuthGuard } from './guards';
const REFRESH_TOKEN = 'refreshtoken';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
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
    const tokens = await this.authService.login(dto, agent);
    if (!tokens) {
      throw new BadRequestException('Invalid credentials');
    }
    this.setRefreshTokenToCookies(tokens, res);

    return {
      accessToken: tokens.accessToken,
    };
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
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshTokens(
      refreshToken.token,
      agent,
    );

    if (!tokens) {
      throw new UnauthorizedException();
    }
    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get('logout')
  @ApiResponse({ status: 200, description: 'User logged out.' })
  @ApiOperation({ summary: 'Logout a user' })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: TokenEntity,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    await this.authService.deleteRefreshToken(refreshToken.id);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.OK);
  }

  /**
   * Sets the refresh token to cookies and returns the access token.
   *
   * @param {Tokens} tokens - The tokens object containing the refresh token.
   * @param {Response} res - The response object to set the cookie on.
   * @return {void}
   */
  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
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
