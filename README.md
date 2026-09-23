# Backend de Turnos y Reservas

API REST desarrollada con **Node.js**, **Express**, **ESM**, **dotenv** y **FileSystem (`fs/promises`)** para gestionar servicios y reservas mediante archivos JSON.

## Arquitectura

La aplicación separa las responsabilidades en tres capas:

```text
Cliente
   ↓
Router
   ↓
Controller
   ↓
Manager
   ↓
Archivo JSON
```

* **Routes:** definen los endpoints y los conectan con los controllers.
* **Controllers:** reciben las solicitudes HTTP, utilizan `req.params`, `req.query` y `req.body`, llaman a los managers y construyen las respuestas con `res.status().json()`. También controlan errores mediante `try/catch`.
* **Managers:** contienen la lógica de negocio y la persistencia en archivos JSON. No utilizan `req` ni `res`.

Esta organización permite separar responsabilidades y preparar el proyecto para futuras etapas del curso.

---

## Tecnologías utilizadas

* Node.js
* Express
* ESM
* dotenv
* FileSystem (`fs/promises`)
* Archivos JSON
* API REST

---

## Funcionalidades

La API gestiona dos recursos:

* `services`: servicios disponibles para reservar.
* `bookings`: reservas realizadas por los clientes.

Los datos se mantienen en archivos JSON aunque el servidor se reinicie.

---

# Services

## Endpoints

| Método | Ruta                 | Descripción                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/services`      | Obtiene todos los servicios |
| GET    | `/api/services/:sid` | Obtiene un servicio por ID  |
| POST   | `/api/services`      | Crea un servicio            |
| PUT    | `/api/services/:sid` | Actualiza un servicio       |
| DELETE | `/api/services/:sid` | Elimina un servicio         |

También se pueden utilizar filtros:

```text
GET /api/services?category=Barbería
GET /api/services?available=true
```

## Estructura de un servicio

```json
{
  "id": 1,
  "name": "Corte de cabello",
  "description": "Corte de cabello para adultos",
  "duration": 30,
  "price": 5000,
  "category": "Peluquería",
  "available": true
}
```

El `id` se genera automáticamente.

Los campos obligatorios para crear un servicio son:

* `name`
* `description`
* `duration`
* `price`
* `category`
* `available`

El `id` no debe enviarse en el body.

### Ejemplo de creación

```http
POST /api/services
```

```json
{
  "name": "Lavado de cabello",
  "description": "Lavado y acondicionamiento del cabello",
  "duration": 15,
  "price": 2000,
  "category": "Peluquería",
  "available": true
}
```

### Ejemplo de actualización

```http
PUT /api/services/2
```

```json
{
  "price": 3500,
  "duration": 25
}
```

El `id` original no puede ser modificado.

### Eliminación

```http
DELETE /api/services/3
```

Si el servicio existe, se elimina y se devuelve el servicio eliminado.

---

# Bookings

## Endpoints

| Método | Ruta                               | Descripción                      |
| ------ | ---------------------------------- | -------------------------------- |
| POST   | `/api/bookings`                    | Crea una reserva                 |
| GET    | `/api/bookings/:bid`               | Obtiene una reserva por ID       |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

## Estructura de una reserva

```json
{
  "id": 1,
  "clientName": "Juan Perez",
  "clientEmail": "juan@email.com",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "pending",
  "services": []
}
```

Una reserva puede comenzar sin servicios asociados.

### Crear una reserva

```http
POST /api/bookings
```

```json
{
  "clientName": "Juan Perez",
  "clientEmail": "juan@email.com",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "pending"
}
```

El `id` se genera automáticamente y `services` comienza vacío.

### Agregar un servicio

```http
POST /api/bookings/1/services/2
```

Los servicios se almacenan utilizando su ID:

```json
{
  "service": 2,
  "quantity": 1
}
```

Si se agrega nuevamente el mismo servicio, aumenta `quantity`.

Antes de asociarlo, la API verifica que la reserva y el servicio existan.

---

# Managers y Controllers

## ServiceManager

Administra `services.json` y contiene:

* `getServices()`
* `getServiceById()`
* `addService()`
* `updateService()`
* `deleteService()`

También valida los campos obligatorios y genera los IDs.

## BookingManager

Administra `bookings.json` y contiene:

* `createBooking()`
* `getBookingById()`
* `addServiceToBooking()`

También verifica la existencia del servicio y aumenta `quantity` cuando corresponde.

## Services Controller

`services.controller.js` contiene:

* `getServices`
* `getServiceById`
* `createService`
* `updateService`
* `deleteService`

Recibe las solicitudes HTTP, delega las operaciones al `ServiceManager`, aplica los filtros mediante `req.query` y controla errores con `try/catch`.

## Bookings Controller

`bookings.controller.js` contiene:

* `createBooking`
* `getBookingById`
* `addServiceToBooking`

Utiliza `BookingManager` y `ServiceManager` cuando es necesario.

---

# Estructura del proyecto

```text
Backend1-Mariano/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── controllers/
│   │   ├── services.controller.js
│   │   └── bookings.controller.js
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
│   ├── managers/
│   │   ├── ServiceManager.js
│   │   └── BookingManager.js
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   ├── app.js
│   └── server.js
│
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

### Responsabilidad de los archivos principales

* `app.js`: configura Express y conecta los routers.
* `server.js`: inicia el servidor.
* `routes/`: define las rutas y las conecta con los controllers.
* `controllers/`: gestiona solicitudes, respuestas y errores HTTP.
* `managers/`: contiene la lógica de negocio y persistencia.
* `data/`: almacena los archivos JSON.
* `config/env.config.js`: carga y valida las variables de entorno.

---

# Persistencia

La información se almacena mediante `fs/promises`.

El proceso consiste en:

1. Leer el JSON.
2. Aplicar `JSON.parse()`.
3. Realizar la operación.
4. Aplicar `JSON.stringify()`.
5. Guardar el archivo.

---

# Variables de entorno

```env
PORT=8080
NODE_ENV=development
```

Se debe crear un archivo `.env` en la raíz tomando como referencia `.env.example`.

El `.env` está incluido en `.gitignore` y no debe subirse al repositorio.

---

# Instalación y ejecución

Instalar dependencias:

```bash
npm install
```

Crear `.env`:

```env
PORT=8080
NODE_ENV=development
```

Iniciar el servidor:

```bash
npm start
```

El comando ejecuta:

```json
"start": "node src/server.js"
```

La API estará disponible en:

```text
http://localhost:8080
```

---

# Códigos de estado HTTP

* `200` → operación realizada correctamente.
* `201` → recurso creado correctamente.
* `400` → solicitud incorrecta o campos obligatorios faltantes.
* `404` → recurso no encontrado.
* `500` → error interno del servidor.

Los controllers utilizan `try/catch` para controlar errores de las operaciones asíncronas y devolver respuestas HTTP adecuadas.

---

# Pruebas realizadas

### Services

* Obtener todos los servicios.
* Obtener un servicio por ID.
* Filtrar por categoría.
* Filtrar por disponibilidad.
* Crear un servicio.
* Validar campos obligatorios.
* Actualizar un servicio.
* Eliminar un servicio.
* Verificar recursos inexistentes.
* Verificar el manejo de errores mediante `try/catch`.

### Bookings

* Crear una reserva.
* Obtener una reserva por ID.
* Agregar un servicio.
* Verificar el incremento de `quantity`.
* Verificar servicios inexistentes.
* Verificar reservas inexistentes.

También se comprobó que la reorganización de la aplicación mantuviera las URLs y el funcionamiento de los endpoints.

Los datos utilizados en pruebas temporales fueron restaurados o eliminados para mantener los archivos JSON de la entrega.

---

# Ejemplos de uso

```http
GET http://localhost:8080/api/services
GET http://localhost:8080/api/services/2
GET http://localhost:8080/api/services?category=Barbería
GET http://localhost:8080/api/services?available=true

GET http://localhost:8080/api/bookings/1
POST http://localhost:8080/api/bookings/1/services/2
```

---

# Estado del proyecto

La API REST permite gestionar **servicios y reservas** utilizando **Node.js, Express y FileSystem**.

La arquitectura mantiene la separación:

```text
Cliente
   ↓
Router
   ↓
Controller
   ↓
Manager
   ↓
Archivo JSON
```

Los routers se encargan únicamente de definir las rutas.

Los controllers gestionan las solicitudes, respuestas y errores HTTP.

Los managers contienen la lógica de negocio y la persistencia.

Los endpoints existentes mantienen sus URLs y comportamiento externo.

Esta estructura permite continuar evolucionando el proyecto hacia repositorios, DAO, validaciones y persistencia mediante MongoDB/Mongoose.
