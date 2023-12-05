import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';

export class CreateCarDto implements Prisma.CarCreateInput {
  @ApiProperty()
  model: string;
  @ApiProperty()
  year: number;
  @ApiProperty({ type: Number })
  price: string | number | Prisma.Decimal | DecimalJsLike;
  @ApiProperty({
    enum: $Enums.Status,
    enumName: 'Status',
  })
  status: $Enums.Status;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
