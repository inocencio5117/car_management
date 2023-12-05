import { Module } from '@nestjs/common';
import { CarModule } from './modules/car/car.module';

@Module({
  imports: [CarModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
