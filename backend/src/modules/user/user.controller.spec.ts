import { TestingModule } from '@nestjs/testing/testing-module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { randomUUID } from 'node:crypto';

const createUserDto: CreateUserDto[] = [
  {
    username: 'JonhDoe',
    email: 'jonh@gmail.com',
    password: '1234',
    role: 'CUSTOMER',
  },
  {
    username: 'MaryJane',
    email: 'jane@gmail.com',
    password: '4321',
    role: 'CUSTOMER',
  },
];

const userList: UserEntity[] = createUserDto.map((item) => {
  return {
    ...item,
    createdAt: new Date('2021-01-01T11:00:00.000Z'),
    updatedAt: new Date('2021-01-01T11:00:00.000Z'),
    id: randomUUID(),
  };
});

const updatedItem: UserEntity = { ...userList[0], username: 'newusername' };

describe('userController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        JwtService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(userList[0]),
            findAll: jest.fn().mockResolvedValue(userList),
            findByEmail: jest.fn().mockResolvedValue(userList[0]),
            findById: jest.fn().mockResolvedValue(userList[0]),
            update: jest.fn().mockResolvedValue(updatedItem),
            remove: jest.fn().mockResolvedValue(userList[0]),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an new item', async () => {
      const result = await controller.create(createUserDto[0]);

      expect(result).toEqual(userList[0]);
      expect(typeof result).toEqual('object');
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      const body: CreateUserDto = { ...userList[0], username: '' };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      expect(controller.create(body)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(userList);
      expect(typeof result).toEqual('object');
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('should return a specific item', async () => {
      const result = await controller.findByEmail(userList[0].email);

      expect(result).toEqual(userList[0]);
      expect(typeof result).toEqual('object');
      expect(service.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', async () => {
      jest
        .spyOn(controller, 'findByEmail')
        .mockRejectedValueOnce(new BadRequestException());

      expect(controller.findByEmail('2')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return a specific item', async () => {
      const result = await controller.findById(userList[0].email);

      expect(result).toEqual(userList[0]);
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

  describe('update', () => {
    it('should update an item', async () => {
      const result = await controller.update(userList[0].id, {
        username: 'newusername',
      });

      expect(result).toEqual(updatedItem);
      expect(typeof result).toEqual('object');
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', () => {
      jest
        .spyOn(controller, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      expect(
        controller.update('1', { username: 'newusername' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const result = await controller.remove('1');

      expect(result).toEqual(userList[0]);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
