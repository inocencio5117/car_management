import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { CarEntity } from './entities/car.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundException } from '@nestjs/common';

const createCarDto: CreateCarDto[] = [
  {
    model: 'Fiat Palio Fire',
    year: 2000,
    price: 14999,
    status: 'AVAILABLE',
  },
  {
    model: 'Fiat Uno Mille',
    year: 1988,
    price: 11999,
    status: 'AVAILABLE',
  },
  {
    model: 'Toyota Corolla',
    year: 2023,
    price: 146989,
    status: 'SOLD',
  },
];

const carsList: CarEntity[] = [
  {
    id: 1,
    model: 'Volkswagen Gol',
    year: 2022,
    price: 57990 as unknown as Decimal,
    status: 'AVAILABLE',
    createdAt: new Date('2021-01-01T11:00:00.000Z'),
    updatedAt: new Date('2021-01-01T11:00:00.000Z'),
  },
  {
    id: 2,
    model: 'Fiat Palio Fire',
    year: 2000,
    price: 14999 as unknown as Decimal,
    status: 'AVAILABLE',
    createdAt: new Date('2021-01-01T11:00:00.000Z'),
    updatedAt: new Date('2021-01-01T11:00:00.000Z'),
  },
];

const updatedItem = { ...carsList[1], year: 2000 };

describe('CarService', () => {
  let service: CarService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: PrismaService,
          useValue: {
            car: {
              create: jest.fn().mockResolvedValue(createCarDto[0]),
              findMany: jest.fn().mockResolvedValue(createCarDto),
              findFirst: jest.fn().mockResolvedValue(carsList[0]),
              update: jest.fn().mockResolvedValue(updatedItem),
              delete: jest.fn().mockResolvedValue(carsList[1]),
              findUnique: jest.fn().mockResolvedValue(carsList[1]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('should create a car', async () => {
      const mockedCar = {
        model: createCarDto[0].model,
        year: createCarDto[0].year,
        price: createCarDto[0].price,
        status: createCarDto[0].status,
      };

      const result = await service.create(mockedCar);

      expect(result).toEqual(createCarDto[0]);
      expect(prisma.car.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const result = await service.findAll();

      expect(result).toEqual(createCarDto);
      expect(prisma.car.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a specific car', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(carsList[0]);
      expect(prisma.car.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception if fail to find the car', async () => {
      jest
        .spyOn(prisma.car, 'findFirst')
        .mockRejectedValue(new NotFoundException());

      expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an item successfully', async () => {
      const result = await service.update(2, { year: 2000 });

      console.log('result', result);

      jest.spyOn(prisma.car, 'update').mockRejectedValueOnce(updatedItem);

      expect(result).toEqual(updatedItem);
    });

    it('should throw an error if item does not exist', () => {
      jest
        .spyOn(prisma.car, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      expect(service.update(99, { year: 1999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const result = await service.remove(2);

      expect(result).toEqual(carsList[1]);
      expect(prisma.car.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.car.delete).toHaveBeenCalledTimes(1);
    });
  });
});
