import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyBriefingDto } from './create-daily-briefing.dto';

export class UpdateDailyBriefingDto extends PartialType(CreateDailyBriefingDto) {}
