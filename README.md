# Order Tracker

REST API built with [NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/) + PostgreSQL to manage orders: create, list, retrieve, update and delete.

## Stack

- [NestJS 11](https://nestjs.com/) (Express)
- [TypeORM](https://typeorm.io/) + PostgreSQL 16
- `class-validator` / `class-transformer` for DTO validation
- Docker / Docker Compose

## Requirements

- [Docker](https://www.docker.com/) + Docker Compose (recommended), **or**
- Node.js 24+ and a local PostgreSQL instance

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable      | Description                                                  | Default        |
| ------------- | ------------------------------------------------------------- | -------------- |
| `NODE_ENV`    | Runtime environment (`development` / `production`)             | `development`  |
| `PORT`        | Port the app listens on                                         | `3000`         |
| `CORS_ORIGIN` | Comma-separated list of allowed origins (empty = allow all)     | _(empty)_      |
| `DB_HOST`     | PostgreSQL host                                                  | `localhost`    |
| `DB_PORT`     | PostgreSQL port                                                  | `5432`         |
| `DB_USERNAME` | PostgreSQL user                                                  | `postgres`     |
| `DB_PASSWORD` | PostgreSQL password                                              | `postgres`     |
| `DB_NAME`     | Database name                                                    | `order_tracker`|
| `DB_SSL`      | Set to `true` when connecting to a Postgres that requires SSL    | `false`        |

## Running with Docker (recommended)

### Development (hot-reload)

```bash
docker compose up --build
```

- App: http://localhost:3000
- PostgreSQL: `localhost:5432`
- The source code is mounted as a volume and `tsc --watch` recompiles automatically on save.
- Tables are auto-synced (`synchronize: true` outside production), so no migrations are needed for local development.

To stop the containers:

```bash
docker compose down
```

### Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Uses a multi-stage image (`Dockerfile`, `production` target) already compiled with `nest build`, with no volumes mounted. On startup, pending migrations run automatically (`migrationsRun: true`).

## Running without Docker

```bash
npm install

# Start only the database with Docker
docker compose up postgres -d

# Start the app in watch mode
npm run start:dev
```

Make sure you have a `.env` with `DB_HOST=localhost` (or the credentials of your local PostgreSQL).

## Database migrations

Schema changes for production are managed through TypeORM migrations (`src/migrations/`), using the data source defined in `src/data-source.ts`.

```bash
npm run migration:generate -- src/migrations/<Name>   # generate a migration from entity changes
npm run migration:run                                   # apply pending migrations
npm run migration:revert                                # revert the last migration
```

In production, `migrationsRun: true` applies pending migrations automatically on startup. In development, `synchronize: true` keeps the schema in sync without migrations.

## Data model: `Order`

| Field          | Type                              | Notes                     |
| -------------- | ---------------------------------- | ------------------------- |
| `id`           | `uuid`                              | Auto-generated             |
| `customerName` | `string`                            | 3 to 40 characters          |
| `item`         | `string`                            | 3 to 20 characters          |
| `quantity`     | `number` (int)                     | Between 1 and 1000          |
| `price`        | `number` (decimal, 2 decimals)     | Greater than 0, up to 100000|
| `status`       | `'Pending' \| 'Paid' \| 'Shipped'`  | Default `'Pending'`         |

Validation rules live in `src/orders/dto/create-order.dto.ts`. `UpdateOrderDto` reuses the same rules with all fields optional.

## API

Endpoints available under `/orders`, plus a health check:

| Method   | Path          | Description                |
| -------- | ------------- | --------------------------- |
| `GET`    | `/health`     | Health check                 |
| `POST`   | `/orders`     | Create an order               |
| `GET`    | `/orders`     | List all orders               |
| `GET`    | `/orders/:id` | Get an order by id (uuid)      |
| `PATCH`  | `/orders/:id` | Update an order                |
| `DELETE` | `/orders/:id` | Delete an order                |

Full contract (types, request/response, `fetch` examples, error handling) in [`API.md`](./API.md).

## Available scripts

```bash
npm run start          # start the app
npm run start:dev      # watch mode
npm run start:prod     # run the compiled build (dist/main)
npm run build           # compile (nest build)
npm run lint            # eslint --fix
npm run format           # prettier --write

npm run migration:generate  # generate a migration from entity changes
npm run migration:run       # apply pending migrations
npm run migration:revert    # revert the last migration
```

## Project structure

```
src/
├── app.module.ts           # root module: ConfigModule + TypeOrmModule
├── app.controller.ts        # health check endpoint
├── data-source.ts           # TypeORM DataSource for the CLI (migrations)
├── main.ts                  # bootstrap + global ValidationPipe + CORS
├── migrations/               # TypeORM migrations
└── orders/
    ├── orders.module.ts
    ├── orders.controller.ts
    ├── orders.service.ts
    ├── dto/
    │   ├── create-order.dto.ts
    │   └── update-order.dto.ts
    ├── entities/
    │   └── order.entity.ts
    └── enums/
        └── orders-status.enum.ts
```
