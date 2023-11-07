// import { Injectable, Module } from '@nestjs/common';
import { Module, Scope } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
// import { Connection } from 'typeorm';

// nest g module 命令行创建 module
// 也可以简写 nest g mo
// 也可以简写 nest g mo moduleName

// class MockCoffeesService {}
// 使用 useValue 替换想要注入的值，这里替换为 MockCoffeesService
// 这通常用于测试，比如在测试中，我们不想真的去连接数据库，而是想用一个 mock 的 service 来代替

class ConfigService {}
class DevelopConfigService {}
class ProductionConfigService {}

// @Injectable()
// class CoffeeBrandsFactory {
//   create() {
//     return ['buddy brew by factory', 'nescafe by factory'];
//   }
// }

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  // providers: [{ provide: CoffeesService, useValue: new MockCoffeesService() }],
  providers: [
    CoffeesService,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopConfigService
          : ProductionConfigService,
    },
    // { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
    // { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew-2', 'nescafe-2'] },
    // CoffeeBrandsFactory,
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (brandsFactory: CoffeeBrandsFactory) =>
    //     brandsFactory.create(),
    //   inject: [CoffeeBrandsFactory],
    // },
    // { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew-2', 'nescafe-2'] },
    // {
    //   provide: COFFEE_BRANDS,
    //   // useFactory 可以绑定异步函数，这可以解决一些复杂的情况，比如服务要等待数据库连接后才能进行响应
    //   // useFactory: async (connection: Connection) => {
    //   useFactory: async () => {
    //     // const coffeeBrands = await connection.query('SELECT * ...');
    //     const coffeeBrands = await Promise.resolve([
    //       'buddy brew in async fun',
    //       'nescafe in async fun',
    //     ]);
    //     console.log('[!] Async factory');
    //     return coffeeBrands;
    //   },
    // },
    {
      provide: COFFEE_BRANDS,
      useFactory: () => ['buddy brew scope', 'nescafe scope'],
      scope: Scope.REQUEST,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
