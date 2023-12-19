import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarEntity } from './entities/car.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { CreateCarDto } from './dto/create-car.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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
  {
    id: 3,
    model: 'Fiat Uno Mille',
    year: 1988,
    price: 11999 as unknown as Decimal,
    status: 'AVAILABLE',
    createdAt: new Date('2021-01-01T11:00:00.000Z'),
    updatedAt: new Date('2021-01-01T11:00:00.000Z'),
  },
  {
    id: 4,
    model: 'Toyota Corolla',
    year: 2023,
    price: 146989 as unknown as Decimal,
    status: 'SOLD',
    createdAt: new Date('2021-01-01T11:00:00.000Z'),
    updatedAt: new Date('2021-01-01T11:00:00.000Z'),
  },
];

const updatedItem = { ...carsList[1], year: 2000 };

describe('CarController', () => {
  let controller: CarController;
  let service: CarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        JwtService,
        {
          provide: CarService,
          useValue: {
            create: jest.fn().mockResolvedValue(carsList[1]),
            findAll: jest.fn().mockResolvedValue(carsList),
            findById: jest.fn().mockResolvedValue(carsList[1]),
            findByModel: jest
              .fn()
              .mockResolvedValue([carsList[1], carsList[2]]),
            update: jest.fn().mockResolvedValue(updatedItem),
            remove: jest.fn().mockResolvedValue(carsList[1]),
          },
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    service = module.get<CarService>(CarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an new item', async () => {
      const result = await controller.create(createCarDto[0]);

      expect(result).toEqual(carsList[1]);
      expect(typeof result).toEqual('object');
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      const body: CreateCarDto = { ...createCarDto[0], model: '' };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      expect(controller.create(body)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(carsList);
      expect(typeof result).toEqual('object');
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a specific item', async () => {
      const result = await controller.findById('2');

      expect(result).toEqual(carsList[1]);
      expect(typeof result).toEqual('object');
      expect(service.findById).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', async () => {
      jest
        .spyOn(controller, 'findById')
        .mockRejectedValueOnce(new BadRequestException());

      expect(controller.findById('2')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByModel', () => {
    it('should return an array of items', async () => {
      const result = await controller.findByModel('Fiat');

      expect(result).toEqual([carsList[1], carsList[2]]);
      expect(typeof result).toEqual('object');
      expect(service.findByModel).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', async () => {
      jest
        .spyOn(controller, 'findByModel')
        .mockRejectedValueOnce(new BadRequestException());

      expect(controller.findByModel('Fiat')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const result = await controller.update('1', { year: 2000 });

      expect(result).toEqual(updatedItem);
      expect(typeof result).toEqual('object');
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', () => {
      jest
        .spyOn(controller, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      expect(controller.update('1', { year: 2000 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const result = await controller.remove('1');

      expect(result).toEqual(carsList[1]);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
