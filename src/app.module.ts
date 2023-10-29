import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CoffeesController } from './coffees/coffees.controller';
// import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [CoffeesModule],
  // controllers: [AppController, CoffeesController],
  controllers: [AppController],
  // providers: [AppService, CoffeesService],
  providers: [AppService],
})
export class AppModule {}
