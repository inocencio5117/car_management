## Description
This is a simple Car Management API built as a training project using Nest.js, Prisma, and PostgreSQL. It provides basic functionality to manage cars and their owners, including CRUD operations and simple relationships.

## Installation

```bash
$ yarn install
```

## Configure the enviroment variables
Add a ```.env``` file for the database credentials and Prisma configuration.

## Setting up the database

### 1: Start the PostgreSQL database using Docker Compose

Use the existing `docker-compose.yml` file to start the database:

```bash
$ docker-compose up -d
```

### Step 2: Run migrations

```bash
$ npx prisma migrate dev
```

### Step 3: Seed the database

```bash
$ npx prisma db seed
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Documentation

This API includes a detailed Swagger documentation for all endpoints. Access at ```/api``` after starting the server.