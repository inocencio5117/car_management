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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':email')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
