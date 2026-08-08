import { Module } from '@nestjs/common';
import { DailyBriefingService } from './daily-briefing.service';
import { DailyBriefingController } from './daily-briefing.controller';
import { DailyBriefingRepository } from './dailt-briefing.repository';

@Module({
  controllers: [DailyBriefingController],
  providers: [DailyBriefingService, DailyBriefingRepository],
})
export class DailyBriefingModule {}
