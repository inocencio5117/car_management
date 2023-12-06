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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { Role as RoleType } from '@prisma/client';
import { Role } from '../auth/decorators/role.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Role(RoleType.ADMIN)
  @UseGuards(AuthenticationGuard, AuthenticationGuard)
  @ApiBearerAuth()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @ApiBearerAuth()
  async findOne(@Param() id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @Role(RoleType.ADMIN)
  @UseGuards(AuthorizationGuard)
  @ApiBearerAuth()
  async update(@Param() id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Role(RoleType.ADMIN)
  @UseGuards(AuthorizationGuard)
  @ApiBearerAuth()
  async remove(@Param() id: string) {
    return await this.usersService.remove(id);
  }
}
