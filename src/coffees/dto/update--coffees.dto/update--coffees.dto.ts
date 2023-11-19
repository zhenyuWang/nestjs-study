import { PartialType } from '@nestjs/swagger';
import { CreateCoffeesDto } from '../create-coffees.dto/create-coffees.dto';

export class UpdateCoffeesDto extends PartialType(CreateCoffeesDto) {}
