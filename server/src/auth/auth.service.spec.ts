import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './../user';
import { UserEntity } from './../entities';
import { TokenEntity } from './../entities/token.entity';
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from 'nestjs-config';

import { faker } from '@faker-js/faker';
import { Token } from './tokens';
import { ConfigType } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let tokenRepository: Repository<TokenEntity>;
    let config;


    const mockUser = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'user',
    } as UserEntity;

    const mockLoginDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
    } as LoginDto;


    const mockConfig = { environment: { NODE_ENV: 'PROD' } };

    const mockToken = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
    } as Token;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findByCredentials: jest.fn(() => mockUser),
                        create: jest.fn(() => mockUser),
                        findById: jest.fn(() => mockUser),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => 'token'),
                    },
                },
                {
                    provide: getRepositoryToken(TokenEntity),
                    useClass: Repository,
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key) => mockConfig[key]),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        tokenRepository = module.get<Repository<TokenEntity>>(getRepositoryToken(TokenEntity));
        config = module.get<ConfigService>(ConfigService).get('jwt');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


});
