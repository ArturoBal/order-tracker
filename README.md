# Order Tracker

API REST construida con [NestJS](https://nestjs.com/) + [TypeORM](https://typeorm.io/) + PostgreSQL para gestionar órdenes (pedidos): alta, listado, consulta, actualización y eliminación.

## Stack

- [NestJS 11](https://nestjs.com/) (Express)
- [TypeORM](https://typeorm.io/) + PostgreSQL 16
- `class-validator` / `class-transformer` para validación de DTOs
- Docker / Docker Compose

## Requisitos

- [Docker](https://www.docker.com/) + Docker Compose (recomendado), **o**
- Node.js 24+ y una instancia de PostgreSQL local

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar si es necesario:

| Variable      | Descripción                              | Default        |
| ------------- | ----------------------------------------- | -------------- |
| `PORT`        | Puerto donde escucha la app                | `3000`         |
| `DB_HOST`     | Host de PostgreSQL                         | `localhost`    |
| `DB_PORT`     | Puerto de PostgreSQL                       | `5432`         |
| `DB_USERNAME` | Usuario de PostgreSQL                      | `postgres`     |
| `DB_PASSWORD` | Password de PostgreSQL                     | `postgres`     |
| `DB_NAME`     | Nombre de la base de datos                 | `order_tracker`|

## Levantar el proyecto con Docker (recomendado)

### Desarrollo (hot-reload)

```bash
docker compose up --build
```

- App: http://localhost:3000
- PostgreSQL: `localhost:5432`
- El código fuente se monta como volumen y `tsc --watch` recompila automáticamente al guardar cambios.
- Las tablas se sincronizan automáticamente (`synchronize: true` fuera de producción), no se necesitan migraciones para desarrollar.

Para detener los contenedores:

```bash
docker compose down
```

### Producción

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Usa una imagen multi-stage (`Dockerfile`, target `production`) ya compilada con `nest build`, sin montar volúmenes.

## Levantar el proyecto sin Docker

```bash
npm install

# Levantar solo la base de datos con Docker
docker compose up postgres -d

# Iniciar la app en modo watch
npm run start:dev
```

Asegúrate de tener un `.env` con `DB_HOST=localhost` (o los datos de tu PostgreSQL local).

## Modelo de datos: `Order`

| Campo          | Tipo                              | Notas                          |
| -------------- | --------------------------------- | ------------------------------ |
| `id`           | `uuid`                            | Generado automáticamente       |
| `customerName` | `string`                           | 3 a 40 caracteres               |
| `item`         | `string`                           | 3 a 20 caracteres               |
| `quantity`     | `number` (int)                    | Entre 1 y 1000                  |
| `price`        | `number` (decimal, 2 decimales)   | Mayor a 0 y hasta 100000        |
| `status`       | `'Pending' \| 'Paid' \| 'Shipped'` | Default `'Pending'`             |

Reglas de validación en `src/orders/dto/create-order.dto.ts`. `UpdateOrderDto` reutiliza las mismas reglas pero con todos los campos opcionales.

## API

Endpoints disponibles bajo `/orders`:

| Método   | Ruta          | Descripción                  |
| -------- | ------------- | ----------------------------- |
| `POST`   | `/orders`     | Crear una orden                |
| `GET`    | `/orders`     | Listar todas las órdenes       |
| `GET`    | `/orders/:id` | Obtener una orden por id (uuid)|
| `PATCH`  | `/orders/:id` | Actualizar una orden            |
| `DELETE` | `/orders/:id` | Eliminar una orden              |

Contrato completo (tipos, request/response, ejemplos `fetch`, manejo de errores) en [`API.md`](./API.md).

## Scripts disponibles

```bash
npm run start          # iniciar la app
npm run start:dev      # modo watch
npm run start:prod     # ejecutar build compilado (dist/main)
npm run build           # compilar (nest build)
npm run lint            # eslint --fix
npm run format           # prettier --write

npm run test             # unit tests
npm run test:e2e         # e2e tests
npm run test:cov         # coverage
```

## Estructura del proyecto

```
src/
├── app.module.ts          # módulo raíz: ConfigModule + TypeOrmModule
├── main.ts                 # bootstrap + ValidationPipe global
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
