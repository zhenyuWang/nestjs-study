import {
  Inject,
  // HttpException,
  // HttpStatus,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeesDto } from './dto/create-coffees.dto/create-coffees.dto';
import { UpdateCoffeesDto } from './dto/update--coffees.dto/update--coffees.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity/event.entity';
// import { ConfigService, ConfigType } from '@nestjs/config';
import { ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// nest generate service 命令行创建 controller
// 简写：nest j s

// @Injectable()
// 默认走的是单例模式，添加了 scope 后就不是了，会为每个符合条件的请求创建一个  service 实例
// @Injectable({ scope: Scope.TRANSIENT }) // 瞬态，下面的 console.log 会触发两次

@Injectable({ scope: Scope.REQUEST }) // 限制该 service 处理请求的返回，这里只处理 request
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    // @Inject('COFFEE_BRANDS') coffeeBrands: string[],
    // private readonly configService: ConfigService, // 获取环境变量

    // 通过以下方式获取配置文件中的配置及类型，提供了类型推导及检查
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    // console.log(coffeeBrands);
    console.log('CoffeesService instantiated');
    // const databaseHost = this.configService.get<string>(
    //   'DATABASE_HOST',
    //   'localhost', // 如果获取不到，就使用默认值
    // );
    // const databaseHost = this.configService.get<string>(
    //   'database.host', // 配合 app.config.ts 中的配置
    // );
    // const databasePassword =
    //   this.configService.get<string>('DATABASE_PASSWORD');
    // console.log(databaseHost, databasePassword);

    // 配合 config/coffeesConfig.config.ts 中的配置
    // const coffeesConfig = this.configService.get('coffees');
    // console.log(coffeesConfig);
    // const coffeesConfig_foo = this.configService.get('coffees.foo');
    // console.log(coffeesConfig_foo);

    console.log('coffeesConfiguration.foo', coffeesConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    // return this.coffeeRepository.find();
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeesDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorsByNames(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeesDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorsByNames(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorsByNames(name: string): Promise<Flavor> {
    const existFlavor = await this.flavorRepository.findOneBy({ name });
    if (existFlavor) {
      return existFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
