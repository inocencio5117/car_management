import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return await this.db.user.create({ data: createUserDto });
  }

  async findAll() {
    return await this.db.user.findMany();
  }

  async findOne(email: string) {
    return this.db.user.findFirst({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    const carExists = await this.db.user.findUnique({
      where: {
        id,
      },
    });

    if (!carExists) throw new NotFoundException('User does not exists');

    return await this.db.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const userExists = await this.db.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) throw new NotFoundException('User does not exists');

    return await this.db.user.delete({
      where: {
        id,
      },
    });
  }
}
