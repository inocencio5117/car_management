import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserEntity } from '../user/entities/user.entity';

const userId = randomUUID();

const mockUser: UserEntity = {
  id: userId,
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'CUSTOMER',
  username: 'test',
  createdAt: new Date('2021-01-01T11:00:00.000Z'),
  updatedAt: new Date('2021-01-01T11:00:00.000Z'),
};

const userServiceMock = {
  findByEmail: jest.fn(),
};

const jwtServiceMock = {
  signAsync: jest.fn(() => 'mockedToken'),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw NotFoundException when user is not found', async () => {
      userServiceMock.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('nonexistent@example.com', 'password'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userServiceMock.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.login('test@example.com', 'invalidPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token when login is successful', async () => {
      userServiceMock.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(
        'test@example.com',
        'validPassword',
      );

      expect(result).toEqual({ access_token: 'mockedToken' });
    });
  });
});
