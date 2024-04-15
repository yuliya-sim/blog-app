import { Module } from '@nestjs/common';
import { UserEntity } from './../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { RolesGuard } from './roles/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { TokenEntity } from '../entities';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('jwt'),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],

  providers: [UserService, RolesGuard],
  exports: [UserService],
})
export class UserModule { }
