import { BlogEntity, PostEntity, TokenEntity, UserEntity } from '../entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([PostEntity, BlogEntity, TokenEntity, UserEntity]),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => config.get('jwt'),
            inject: [ConfigService],
        }),
    ],
    controllers: [PostController],

    providers: [PostService],
})
export class PostModule { }
