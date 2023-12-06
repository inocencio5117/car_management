import { Module } from '@nestjs/common';
import { CarModule } from './modules/car/car.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CarModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
