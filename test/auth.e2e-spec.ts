import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

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

  it('/auth/login (POST) - should return an access token on successful login', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body.access_token).toBeDefined();
  });

  it('/auth/login (POST) - should return 404 on login with non-existent user', async () => {
    const loginDto = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(404);
  });

  it('/auth/login (POST) - should return 401 on login with incorrect password', async () => {
    const loginDto = { email: 'test@example.com', password: 'invalidPassword' };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401);
  });

  it('/auth/profile (GET) - should return user profile with valid token', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    const profileResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200);

    expect(profileResponse.body).toEqual({
      userId: expect.any(String),
      email: 'test@example.com',
      role: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('/auth/profile (GET) - should return 401 with invalid token', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', 'Bearer invalidToken')
      .expect(401);
  });
});
