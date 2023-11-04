// import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // 将字符串转为数字
  offset: number;
}
