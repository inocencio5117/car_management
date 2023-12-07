import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { randomUUID } from 'node:crypto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(userList[0]),
              findMany: jest.fn().mockResolvedValue(userList),
              findFirstOrThrow: jest.fn().mockResolvedValue(userList[0]),
              update: jest.fn().mockResolvedValue(updatedItem),
              delete: jest.fn().mockResolvedValue(userList[0]),
              findUnique: jest.fn().mockResolvedValue(userList[0]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const result = await service.create(createUserDto[0]);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...resultWithPassowrdRemoved } = userList[0];

      expect(result).toEqual(resultWithPassowrdRemoved);
    });

    it('should raise an error', async () => {
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValueOnce(new BadRequestException());

      expect(service.create(createUserDto[0])).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();

      expect(result).toEqual(userList);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('should return a specific item', async () => {
      const result = await service.findByEmail(userList[0].email);

      expect(result).toEqual(userList[0]);
      expect(prisma.user.findFirstOrThrow).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', async () => {
      jest
        .spyOn(service, 'findByEmail')
        .mockRejectedValueOnce(new NotFoundException());

      expect(service.findByEmail).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a specific item', async () => {
      const result = await service.findById(userList[0].id);

      expect(result).toEqual(userList[0]);
      expect(prisma.user.findFirstOrThrow).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValueOnce(new NotFoundException());

      expect(service.findById).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const result = await service.update(userList[0].id, {
        username: 'newusername',
      });

      expect(result).toEqual(updatedItem);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });

    it('should raise an exception', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new BadRequestException());

      expect(service.update).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const result = await service.remove(userList[0].id);

      expect(result).toEqual(userList[0]);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
    });

    it('should raise an error', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException());

      expect(service.remove).rejects.toThrow(NotFoundException);
    });
  });
});
