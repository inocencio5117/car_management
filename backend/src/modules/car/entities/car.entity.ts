import { $Enums, Car } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class CarEntity implements Car {
  id: number;
  model: string;
  year: number;
  price: Decimal;
  status: $Enums.Status;
  createdAt: Date;
  updatedAt: Date;
}
