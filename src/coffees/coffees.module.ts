import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

// nest g module 命令行创建 module
// 也可以简写 nest g mo
// 也可以简写 nest g mo moduleName

@Module({ controllers: [CoffeesController], providers: [CoffeesService] })
export class CoffeesModule {}
