import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

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
    createUserDto.role = Role.CUSTOMER;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = await this.db.user.create({
      data: createUserDto,
    });

    return newUser;
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

    const userExists = await this.db.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) throw new NotFoundException('User does not exists');

    updateUserDto.role = updateUserDto.role;
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
