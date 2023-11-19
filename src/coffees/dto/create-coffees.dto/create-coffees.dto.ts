// nest g class coffees/dto/create-coffees.dto--no - spec
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateCoffeesDto {
  // 在文档上为每个属性添加默认值、描述等信息
  @ApiProperty({ description: 'The name of a coffee.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The brand of a coffee.' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'The flavors of a coffee.' })
  @IsString({ each: true })
  readonly flavors: string[];
}
