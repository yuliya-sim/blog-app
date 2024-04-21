import { ConfigModule } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

import { BlogModule } from './blog';
import { Module } from '@nestjs/common';
import { UserModule } from './user';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { PostModule } from './post';
import { CommentModule } from './comment/comment.module';
import { AmortizationScheduleModule } from './amortization/amortization-schedule.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '*.{ts,js}')),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    BlogModule,
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    AmortizationScheduleModule,
  ],
  providers: [AppService],
})
export class AppModule { }
