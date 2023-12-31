import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CarService {
  constructor(private db: PrismaService) {}

  async create(createCarDto: CreateCarDto) {
    return await this.db.car.create({ data: createCarDto });
  }

  async findAll() {
    return await this.db.car.findMany();
  }

  async findById(id: number) {
    return await this.db.car.findFirst({
      where: {
        id,
      },
    });
  }

  async findByModel(model: string) {
    return await this.db.car.findMany({
      where: {
        model: {
          contains: model,
          mode: 'insensitive',
        },
      },
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const carExists = await this.db.car.findUnique({
      where: {
        id,
      },
    });

    if (!carExists) throw new NotFoundException('Car does not exists');

    return await this.db.car.update({
      where: {
        id,
      },
      data: updateCarDto,
    });
  }

  async remove(id: number) {
    const carExists = await this.db.car.findUnique({
      where: {
        id,
      },
    });

    if (!carExists) throw new NotFoundException('Car does not exists');

    return await this.db.car.delete({
      where: {
        id,
      },
    });
  }
}
