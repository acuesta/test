# Users and credentials

NestJS service for registering users, checking passwords, and rotating credentials. The domain model does not depend on Nest, HTTP, or the database.

Users are stored in memory. Restarting the process clears them. Password hashes never appear in API responses.

## Layout

```
src/
  domain/           User, email, password policy, and ports
  application/      Use cases: register, login, change password, read users
  infrastructure/   HTTP controllers, bcrypt, HMAC tokens, in-memory storage
```

Dependency direction is inward:

- HTTP and storage implement ports declared by the domain.
- Use cases call those ports. They do not import Nest or bcrypt.
- `UserModule` is the composition root that binds each port to an adapter.

To persist users somewhere else, implement `UserRepository` and replace `InMemoryUserRepository` in `src/infrastructure/user.module.ts`. The use cases stay the same.

## Run

```bash
cp .env.example .env
npm install
npm test
npm run start:dev
```

`TOKEN_SECRET` signs access tokens. In production it must be at least 16 characters. Outside production, a local default is used when the variable is missing.

## API

`POST /auth/register`

```json
{ "email": "ada@example.com", "password": "correcthorse1", "displayName": "Ada" }
```

`POST /auth/login`

```json
{ "email": "ada@example.com", "password": "correcthorse1" }
```

Returns a bearer token. Passwords must be 8–72 characters and include a letter and a number.

`GET /users/me` and `GET /users` require `Authorization: Bearer <token>`.

`POST /users/me/password`

```json
{ "currentPassword": "correcthorse1", "newPassword": "newpassword2" }
```

Returns `204` when the current password matches.

## Investigations

Open cases for the deduction game. Each case seats the first suspects in a circle, gives every suspect one statement, and fixes how many culprits and true statements there are. Guilt and honesty are independent. A diet or height claim is true when at least one culprit matches it. "A or B did it" is false only when both are innocent. "A and B are lying" is false when either one tells the truth.

`GET /investigations` lists the cases. `GET /investigations/:id` returns the suspects and statements, without the solution.

`POST /investigations/:id/solutions`

```json
{ "culprits": ["shark"], "elapsedSeconds": 90 }
```

The response says whether the guess matches the single solution and how many stars the elapsed time earned. Three stars means the guess landed inside the first time limit, then two, then one. A wrong guess scores zero.
