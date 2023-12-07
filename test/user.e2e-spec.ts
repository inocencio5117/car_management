import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Adjust the path based on your project structure
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'test',
      email: 'test@test.dev',
      password: '1234',
      role: 'CUSTOMER',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = response.body;
    createdUserId = createdUser.id;
    expect(response.body).toBeDefined();
    expect(response.body.email).toBe(createUserDto.email);
  });

  it('/users (GET) - should return all users', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200);

    const users = response.body;
    expect(Array.isArray(users)).toBe(true);
  });

  it('/users/:email (GET) - should get a user by the email', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    const email = 'test@example.com';

    const response = await request(app.getHttpServer())
      .get(`/users/${email}`)
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.email).toBe(email);
  });

  //   it('/users/:id (GET) - should get a user by the id', async () => {
  //     const loginDto = { email: 'test@example.com', password: 'password123' };

  //     const loginResponse = await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send(loginDto)
  //       .expect(200);

  //     const response = await request(app.getHttpServer())
  //       .get(`/users/${createdUserId}`)
  //       .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
  //       .expect(200);

  //     expect(response.body).toBeDefined();
  //     expect(response.body.id).toEqual(createdUserId);
  //   });

  it('/users/:id (PATCH) - should update an user', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const updateUserDto = {
      username: 'updatedTest',
    };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    const response = await request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toEqual(updateUserDto.username);
  });

  it('/users/:id (DELETE) - should delete an user', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(404);
  });
});
