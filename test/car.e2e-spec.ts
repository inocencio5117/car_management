import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module'; // Replace with the actual path to your AppModule
import { CreateCarDto } from 'src/modules/car/dto/create-car.dto';

describe('CarController (Integration)', () => {
  let app: INestApplication;
  let createdCarId: number;

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

  it('/car (POST) - should create a car', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const createCarDto: CreateCarDto = {
      model: 'Test Model',
      price: '17000',
      year: 2022,
      status: 'SOLD',
    };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    const response = await request(app.getHttpServer())
      .post('/car')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .send(createCarDto)
      .expect(201);

    const createdCar = response.body;
    createdCarId = createdCar.id;
    expect(createdCar).toMatchObject(createCarDto);
  });

  it('/car (GET) - should get all cars', async () => {
    const response = await request(app.getHttpServer()).get('/car').expect(200);

    const cars = response.body;
    expect(Array.isArray(cars)).toBe(true);
  });

  it('/car/:id (PATCH) - should update a car', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const updateCarDto = {
      model: 'Updated Model',
    };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    const response = await request(app.getHttpServer())
      .patch(`/car/${createdCarId}`)
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .send(updateCarDto)
      .expect(200);

    const updatedCar = response.body;
    expect(updatedCar.model).toEqual(updateCarDto.model);
  });

  it('/car/:id (GET) - should get a specific car', async () => {
    const response = await request(app.getHttpServer())
      .get(`/car/${createdCarId}`)
      .expect(200);

    const retrievedCar = response.body;
    expect(retrievedCar.id).toEqual(createdCarId);
  });

  it('/car/:id (DELETE) - should delete a car', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/car/${createdCarId}`)
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200);

    // Check if the car is no longer available after deletion
    await request(app.getHttpServer()).get(`/car/${createdCarId}`).expect(404);
  });
});
