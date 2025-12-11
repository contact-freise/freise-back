import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  post?: string;

  @IsString()
  @IsOptional()
  mentionnedUser?: string;
}

