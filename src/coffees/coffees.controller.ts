import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  // Query,
  // Put,
  // Res,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeesDto } from './dto/create-coffees.dto/create-coffees.dto';
import { UpdateCoffeesDto } from './dto/update--coffees.dto/update--coffees.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

// nest generate controller 命令行创建 controller
// 简写 nest g co, 如果不需要测试 nest g co--no - spec

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  // @Get()
  // @Get('test') // 也可以写成 @Get('test')，这样就会变成 /coffees/test
  // findAll() {
  //   return 'This action returns all coffees';
  // }

  // @Get()
  // findAll(@Res() response) {
  // 使用底层库的响应对象返回结果 nestjs 默认底层库为 express
  // 但这种方式并不推荐，因为这样就会失去 nestjs 的优势，而且测试也会变得困难，要模拟 response 对象
  // response.status(210).send('This action returns all coffees');
  // }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    // findAll(@Query() paginationQuery) {
    // return `This action returns all coffees. Limit: ${paginationQuery.limit}, Offset: ${paginationQuery.offset}`;
    // const { limit, offset } = paginationQuery;
    // return `This action returns all coffees. Limit: ${limit}, Offset: ${offset}`;
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  // fundOne(@Param() params) {
  fundOne(@Param('id') id: string) {
    // 也可以只接收部分数据，比如这里只接收 id
    // return `This action returns #${id} coffee`;
    return this.coffeesService.findOne(id);
  }

  // @HttpCode(HttpStatus.GONE) // 设置返回状态码

  // create(@Body() body) {
  //   // create(@Body('name') body) {
  //   // 只接收 name
  //   return body;
  // }
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeesDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  // 更新资源的方式有两种
  // @Put(':id') // 创建或完整更新
  // 1. put 会替换整个资源
  // update(@Param('id') id: string, @Body() body) {
  //   console.log('patch update', body);
  //   return `This action updates a #${id} coffee`;
  // }
  // 2. patch 只会替换部分资源
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeesDto: UpdateCoffeesDto) {
    // console.log('patch update', body);
    // return `This action updates #${id} coffee`;
    return this.coffeesService.update(id, updateCoffeesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return `This action removes #${id} coffee`;
    return this.coffeesService.remove(id);
  }
}
