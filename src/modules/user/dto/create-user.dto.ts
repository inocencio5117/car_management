import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  role: $Enums.Role;
}
