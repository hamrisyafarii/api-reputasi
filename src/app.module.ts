import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './modules/user/user.module.js';
import { auth } from './modules/auth/auth.js';
import { PrismaModule } from './infra/database/prisma.module.js';
import { DailyBriefingModule } from './modules/daily-briefing/daily-briefing.module';
import { MentionsModule } from './modules/mentions/mentions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({ auth }),
    PrismaModule,
    UserModule,
    DailyBriefingModule,
    MentionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
