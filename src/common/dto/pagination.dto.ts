import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  //Para TS
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  //Para TS
  offset?: number;
}
