import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';
import { IsNotEmpty } from 'class-validator';

export class CreateCarDto implements Prisma.CarCreateInput {
  @IsNotEmpty()
  @ApiProperty()
  model: string;

  @IsNotEmpty()
  @ApiProperty()
  year: number;

  @IsNotEmpty()
  @ApiProperty({ type: Number })
  price: string | number | Prisma.Decimal | DecimalJsLike;

  @IsNotEmpty()
  @ApiProperty({
    enum: $Enums.Status,
    enumName: 'Status',
  })
  status: $Enums.Status;
}
