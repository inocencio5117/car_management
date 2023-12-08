import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserDto implements User {
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER',
}
