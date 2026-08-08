import { IsString } from 'class-validator';

export class CreateDailyBriefingDto {
  @IsString()
  projectId: string;
}
