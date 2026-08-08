import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class MentionsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
