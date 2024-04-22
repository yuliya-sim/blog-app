
## Description


Server application is a NestJS application. It is a RESTful API
server for a blog application. It uses NestJS framework, TypeScript,
PostgreSQL, JWT tokens, Swagger.

The server application provides the following endpoints:

- Auth endpoint for user authentication.
- User endpoint for user registration, deletion, and retrieval.
- Blog endpoint for blog creation, deletion, and retrieval.
- Post endpoint for blog posts creation, deletion, and retrieval.
- Comment endpoint for blog posts comments creation, deletion, and retrieval.
- Schedule endpoint for amortization-schedule calculator.

The server application also uses Swagger to generate API documentation.
You can access the Swagger UI at `http://localhost:8081/api`.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test




