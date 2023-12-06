import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';

export class CreateUserDto implements Prisma.UserCreateInput {
  id?: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  role: $Enums.Role;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
