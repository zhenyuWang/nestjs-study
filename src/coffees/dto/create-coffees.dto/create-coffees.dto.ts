// nest g class coffees/dto/create-coffees.dto--no - spec
import { IsString } from 'class-validator';
export class CreateCoffeesDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavors: string[];
}
