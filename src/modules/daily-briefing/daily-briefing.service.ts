import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateDailyBriefingDto } from './dto/create-daily-briefing.dto';
import { DailyBriefingRepository } from './dailt-briefing.repository';
import { PrismaService } from 'src/infra/database/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class DailyBriefingService {
  private readonly logger = new Logger(DailyBriefingService.name);
  private openai: OpenAI;
  constructor(
    private readonly repo: DailyBriefingRepository,
    private readonly prisma: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: process.env.GROQ_BASE_URL,
    });
  }

  async create(createDailyBriefingDto: CreateDailyBriefingDto) {
    // get date today
    const today = new Date();
    const startOFDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get Mention by projectId
    const mentions = await this.prisma.mention.findMany({
      where: {
        projectId: createDailyBriefingDto.projectId,
        createdAt: {
          gte: startOFDay,
          lte: endOfDay,
        },
      },
    });

    if (mentions.length === 0) {
      throw new NotFoundException(
        'Belum ada data obrolan/mention hari ini untuk diproses.',
      );
    }

    // Data For ai
    const dataForAI = mentions
      .map(
        (m, index) => `[${index + 1}] Sumber: ${m.source} | Isi: ${m.content}`,
      )
      .join('\n');

    const prompt = `
      Anda adalah Asisten AI untuk RepuTasi (AI Co-Pilot). 
      Tugas Anda adalah membaca data obrolan netizen (mentions) hari ini, kemudian membuat Executive Briefing untuk Pimpinan.

      Berikut adalah data mentions hari ini:
      ${dataForAI}

      Tolong berikan respons MURNI dalam format JSON persis seperti struktur berikut:
      {
        "summary": "Tuliskan rangkuman situasi reputasi hari ini secara profesional maksimal 2 paragraf.",
        "recommendation": "Berikan 3 poin saran tindakan strategis yang harus dilakukan oleh Pimpinan."
      }`;

    try {
      // Panggil ai
      const completion = await this.openai.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }, // Ini fitur canggih agar AI PASTI membalas pakai JSON
        temperature: 0.5, // Dibuat 0.5 agar bahasanya terukur dan tidak terlalu berhalusinasi
      });

      const aiAnalysis = JSON.parse(
        completion.choices[0].message?.content || '{}',
      ) as {
        summary: string;
        recommendation: string;
      };

      const result = await this.repo.create({
        projectId: createDailyBriefingDto.projectId,
        summary: aiAnalysis.summary,
        recommendation: aiAnalysis.recommendation,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to create daily briefing:', error);
      throw new InternalServerErrorException(
        'Gagal menghubungi sistem AI Co-Pilot.',
      );
    }
  }

  findAll() {
    return `This action returns all dailyBriefing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyBriefing`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyBriefing`;
  }
}
