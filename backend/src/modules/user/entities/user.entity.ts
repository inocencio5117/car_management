import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
}
