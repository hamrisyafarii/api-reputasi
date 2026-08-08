import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

interface CreateDailyBriefingData {
  projectId: string;
  summary: string;
  recommendation: string;
}

@Injectable()
export class DailyBriefingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDailyBriefingData) {
    return this.prisma.dailyBriefing.create({
      data: {
        projectId: data.projectId,
        summary: data.summary,
        recommendation: data.recommendation,
      },
    });
  }
}
