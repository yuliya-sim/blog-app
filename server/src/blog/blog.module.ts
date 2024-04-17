import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity, UserEntity } from './../entities';
import { BlogService } from './blog.service';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { BlogController } from './blog.controller';
import { SlugProvider } from './slug.provider';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([BlogEntity, UserEntity]),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('jwt'),
      inject: [ConfigService],
    }),
  ],
  controllers: [BlogController],
  providers: [SlugProvider, BlogService],
})
export class BlogModule { }
