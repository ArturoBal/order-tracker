# Order Tracker API — Contrato para Frontend

Base URL: `http://localhost:3000` (configurable vía variable de entorno `PORT`)

Todas las respuestas y peticiones son JSON (`Content-Type: application/json`).

## Validación

El backend usa un `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`:

- Cualquier campo no definido en el DTO correspondiente provoca **400 Bad Request**.
- Los campos definidos se validan según las reglas indicadas más abajo.

## Tipos

```typescript
type OrderStatus = 'Pending' | 'Paid' | 'Shipped';

interface Order {
  id: string;          // UUID
  customerName: string;
  item: string;
  quantity: number;     // entero entre 1 y 1000
  price: number;        // > 0 y <= 100000, hasta 2 decimales
  status: OrderStatus;  // default: 'Pending'
}

// Body para crear una orden
interface CreateOrderDto {
  customerName: string;  // requerido, 3 a 40 caracteres
  item: string;          // requerido, 3 a 20 caracteres
  quantity: number;       // requerido, entre 1 y 1000
  price: number;          // requerido, > 0 y <= 100000
  status?: OrderStatus;   // opcional, default 'Pending'
}

// Body para actualizar una orden (todos los campos opcionales)
type UpdateOrderDto = Partial<CreateOrderDto>;
```

## Errores

Formato estándar de error (filtro por defecto de NestJS):

```json
{
  "statusCode": 400,
  "message": "Order #<id> not found",
  "error": "Not Found"
}
```

En errores de validación del **body**, `message` es un arreglo de strings con cada problema:

```json
{
  "statusCode": 400,
  "message": [
    "status must be one of the following values: Pending, Paid, Shipped"
  ],
  "error": "Bad Request"
}
```

Si `:id` no es un UUID válido, `message` es un string:

```json
{
  "statusCode": 400,
  "message": "Validation failed (uuid is expected)",
  "error": "Bad Request"
}
```

| statusCode | Cuándo ocurre |
| --- | --- |
| 400 | Body inválido, campo extra no permitido, o `:id` no es un UUID válido |
| 404 | No existe una orden con el `id` indicado |

---

## Endpoints

### `POST /orders` — Crear una orden

**Body** (`CreateOrderDto`):

```json
{
  "customerName": "Juan Perez",
  "item": "Laptop",
  "quantity": 1,
  "price": 1200.50,
  "status": "Pending"
}
```

> `status` es opcional; si se omite, se guarda como `"Pending"`.

**Respuesta** — `201 Created`:

```json
{
  "id": "3f1b1e2a-1234-4a5b-9c6d-7e8f9a0b1c2d",
  "customerName": "Juan Perez",
  "item": "Laptop",
  "quantity": 1,
  "price": 1200.5,
  "status": "Pending"
}
```

---

### `GET /orders` — Listar todas las órdenes

**Respuesta** — `200 OK`:

```json
[
  {
    "id": "3f1b1e2a-1234-4a5b-9c6d-7e8f9a0b1c2d",
    "customerName": "Juan Perez",
    "item": "Laptop",
    "quantity": 1,
    "price": 1200.5,
    "status": "Pending"
  }
]
```

---

### `GET /orders/:id` — Obtener una orden por id

- `:id` debe ser un UUID válido (si no, `400 Bad Request`).

**Respuesta** — `200 OK`:

```json
{
  "id": "3f1b1e2a-1234-4a5b-9c6d-7e8f9a0b1c2d",
  "customerName": "Juan Perez",
  "item": "Laptop",
  "quantity": 1,
  "price": 1200.5,
  "status": "Pending"
}
```

- `404 Not Found` si no existe una orden con ese `id`.

---

### `PATCH /orders/:id` — Actualizar una orden

**Body** (`UpdateOrderDto`, todos los campos opcionales — enviar solo los que cambian):

```json
{
  "status": "Shipped"
}
```

**Respuesta** — `200 OK`: la orden completa actualizada.

```json
{
  "id": "3f1b1e2a-1234-4a5b-9c6d-7e8f9a0b1c2d",
  "customerName": "Juan Perez",
  "item": "Laptop",
  "quantity": 1,
  "price": 1200.5,
  "status": "Shipped"
}
```

- `404 Not Found` si no existe una orden con ese `id`.

---

### `DELETE /orders/:id` — Eliminar una orden

**Respuesta** — `200 OK`, sin body.

- `404 Not Found` si no existe una orden con ese `id`.

---

## Ejemplo de uso (fetch)

```typescript
const API_URL = 'http://localhost:3000';

// Crear orden
async function createOrder(data: CreateOrderDto): Promise<Order> {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Listar órdenes
async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`);
  return res.json();
}

// Obtener una orden
async function getOrder(id: string): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Actualizar estado de una orden
async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Eliminar una orden
async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await res.json();
}
```
