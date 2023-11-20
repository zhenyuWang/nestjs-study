import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeesDto } from 'src/coffees/dto/create-coffees.dto/create-coffees.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 自动删除未知属性,
        // 自动转换类型 包括请求 body 转为 dto 实例，路由参数转为期望类型，id: string => id: number
        // 注意：会轻微影响性能，如果确定开启，需确认性能影响是否可接受
        transform: true,
        forbidNonWhitelisted: true, // 如果有未知属性，抛出异常
        transformOptions: {
          enableImplicitConversion: true, // 是否进行隐式转换
        },
      }),
    ); // 全局管道
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeesDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedCoffee = {
          ...coffee,
          description: null,
          recommendations: 0,
          id: expect.any(Number),
          flavors: expect.arrayContaining(
            coffee.flavors.map((name) => expect.objectContaining({ name })),
          ),
        };
        expect(body).toEqual(expectedCoffee);
      });
  });
  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .then(({ body }) => {
        const expectedCoffee = {
          ...coffee,
          description: null,
          recommendations: 0,
          id: expect.any(Number),
          flavors: expect.arrayContaining(
            coffee.flavors.map((name) => expect.objectContaining({ name })),
          ),
        };
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(expectedCoffee);
      });
  });
  it('Get one [GET /:id]', () => {
    return request(app.getHttpServer())
      .get('/coffees/1')
      .then(({ body }) => {
        const expectedCoffee = {
          ...coffee,
          description: null,
          recommendations: 0,
          id: expect.any(Number),
          flavors: expect.arrayContaining(
            coffee.flavors.map((name) => expect.objectContaining({ name })),
          ),
        };
        expect(body).toEqual(expectedCoffee);
      });
  });
  it('Update one [PATCH /:id]', () => {
    const updateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast',
    };
    return request(app.getHttpServer())
      .patch('/coffees/1')
      .send(updateCoffeeDto)
      .then(({ body }) => {
        const expectedCoffee = {
          id: 1,
          ...coffee,
          description: null,
          recommendations: 0,
          flavors: expect.arrayContaining(
            coffee.flavors.map((name) => expect.objectContaining({ name })),
          ),
        };
        expectedCoffee.name = updateCoffeeDto.name;
        expect(body).toEqual(expectedCoffee);
      });
  });
  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/coffees/1')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
