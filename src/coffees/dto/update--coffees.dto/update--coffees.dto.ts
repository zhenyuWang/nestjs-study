import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeesDto } from '../create-coffees.dto/create-coffees.dto';

export class UpdateCoffeesDto extends PartialType(CreateCoffeesDto) {}
