import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { Role as RoleType } from '@prisma/client';
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

// Mock AuthService
const authServiceMock = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideGuard(AuthenticationGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mocking AuthenticationGuard
      .overrideGuard(AuthorizationGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mocking AuthorizationGuard
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return the result from authService.login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      authServiceMock.login.mockReturnValue({ access_token: 'mockedToken' });

      const result = await controller.login(loginDto);

      expect(result).toEqual({ access_token: 'mockedToken' });
      expect(authServiceMock.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request object', () => {
      const mockRequest = { user: mockUser };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });

    it('should have the @UseGuards decorators and @Role decorator', () => {
      const metadata = Reflect.getMetadata('role', controller.getProfile);
      const useGuardsMetadata = Reflect.getMetadata(
        '__guards__',
        controller.getProfile,
      );

      expect(metadata).toEqual(RoleType.ADMIN);
      expect(useGuardsMetadata).toContain(AuthenticationGuard);
      expect(useGuardsMetadata).toContain(AuthorizationGuard);
    });
  });
});
