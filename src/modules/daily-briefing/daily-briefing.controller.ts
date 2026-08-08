import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DailyBriefingService } from './daily-briefing.service';
import { CreateDailyBriefingDto } from './dto/create-daily-briefing.dto';

@Controller('daily-briefing')
export class DailyBriefingController {
  constructor(private readonly dailyBriefingService: DailyBriefingService) {}

  @Post('generate')
  create(@Body() createDailyBriefingDto: CreateDailyBriefingDto) {
    return this.dailyBriefingService.create(createDailyBriefingDto);
  }

  @Get()
  findAll() {
    return this.dailyBriefingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyBriefingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyBriefingService.remove(+id);
  }
}
