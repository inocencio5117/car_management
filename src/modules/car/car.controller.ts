import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role as RoleType } from '@prisma/client';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Role } from '../auth/decorators/role.decorator';

@Controller('car')
@ApiTags('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
