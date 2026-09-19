# Backend de Turnos y Reservas

API REST desarrollada con **Node.js**, **Express**, **ESM** y **FileSystem (`fs/promises`)** para gestionar servicios y reservas de un sistema de turnos.

El proyecto corresponde a una API REST con persistencia de datos mediante archivos JSON.

La estructura interna está organizada en tres capas principales:

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

Esta organización permite separar las responsabilidades de cada parte de la aplicación y preparar el proyecto para futuras etapas del curso.

---

## Tecnologías utilizadas

* Node.js
* Express
* Módulos ESM
* dotenv
* FileSystem (`fs/promises`)
* Archivos JSON
* API REST

---

## Funcionalidades

La API permite gestionar dos recursos principales:

* `services`: servicios disponibles para reservar.
* `bookings`: reservas realizadas por los clientes.

Los datos se almacenan en archivos JSON, permitiendo mantener la información aunque el servidor se reinicie.

---

# Arquitectura

El proyecto está organizado en tres capas:

### Routes

Los routers definen las rutas HTTP y conectan cada endpoint con su controller.

No contienen lógica de negocio ni acceso directo a los archivos JSON.

### Controllers

Los controllers reciben las solicitudes HTTP, obtienen los datos de:

* `req.params`
* `req.query`
* `req.body`

Luego llaman a los métodos correspondientes de los managers y devuelven la respuesta mediante:

```js
res.status().json()
```

### Managers

Los managers contienen la lógica de negocio y la persistencia de datos.

Son responsables de:

* Leer archivos JSON.
* Escribir archivos JSON.
* Buscar recursos.
* Crear recursos.
* Actualizar recursos.
* Eliminar recursos.
* Validar información necesaria para las operaciones.

Los managers no utilizan `req` ni `res`.

---

# Endpoints de Services

| Método | Ruta                 | Descripción                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/services`      | Obtiene todos los servicios |
| GET    | `/api/services/:sid` | Obtiene un servicio por ID  |
| POST   | `/api/services`      | Crea un nuevo servicio      |
| PUT    | `/api/services/:sid` | Actualiza un servicio       |
| DELETE | `/api/services/:sid` | Elimina un servicio         |

También se pueden utilizar query params para filtrar servicios:

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

El `id` se genera automáticamente al crear un servicio.

## Crear un servicio

```http
POST /api/services
```

Body:

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

El `id` no debe enviarse desde el body.

## Actualizar un servicio

```http
PUT /api/services/2
```

Body:

```json
{
  "price": 3500,
  "duration": 25
}
```

El `id` original no puede ser modificado.

## Eliminar un servicio

```http
DELETE /api/services/3
```

Si el servicio existe, se elimina y se devuelve el servicio eliminado.

---

# Endpoints de Bookings

| Método | Ruta                               | Descripción                      |
| ------ | ---------------------------------- | -------------------------------- |
| POST   | `/api/bookings`                    | Crea una nueva reserva           |
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

## Crear una reserva

```http
POST /api/bookings
```

Body:

```json
{
  "clientName": "Juan Perez",
  "clientEmail": "juan@email.com",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "pending"
}
```

El `id` se genera automáticamente y el array `services` comienza vacío.

## Agregar un servicio a una reserva

```http
POST /api/bookings/1/services/2
```

Los servicios se almacenan dentro de la reserva utilizando solamente el ID del servicio:

```json
{
  "service": 2,
  "quantity": 1
}
```

Si el mismo servicio se agrega nuevamente, se incrementa su cantidad:

```json
{
  "service": 2,
  "quantity": 2
}
```

Antes de asociar un servicio, la API verifica que tanto la reserva como el servicio existan.

---

# Managers

## ServiceManager

`ServiceManager` administra el archivo `services.json` y contiene los métodos:

* `getServices()`
* `getServiceById()`
* `addService()`
* `updateService()`
* `deleteService()`

También se encarga de validar los campos obligatorios y generar automáticamente los IDs.

## BookingManager

`BookingManager` administra el archivo `bookings.json` y contiene los métodos:

* `createBooking()`
* `getBookingById()`
* `addServiceToBooking()`

También verifica la existencia del servicio antes de asociarlo a una reserva y aumenta `quantity` cuando el servicio ya se encuentra agregado.

---

# Controllers

## services.controller.js

Contiene los controllers correspondientes al recurso `services`:

* `getServices`
* `getServiceById`
* `createService`
* `updateService`
* `deleteService`

Los controllers reciben los datos de la solicitud HTTP y delegan las operaciones al `ServiceManager`.

Los filtros de servicios se obtienen mediante `req.query`.

## bookings.controller.js

Contiene los controllers correspondientes al recurso `bookings`:

* `createBooking`
* `getBookingById`
* `addServiceToBooking`

`addServiceToBooking` utiliza `ServiceManager` para verificar que el servicio exista antes de asociarlo a la reserva.

---

# Estructura del proyecto

```text
Backend1-Mariano/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── controllers/
│   │   ├── services.controller.js
│   │   └── bookings.controller.js
│   │
│   ├── data/
│   │   ├── services.json
│   │   └── bookings.json
│   │
│   ├── managers/
│   │   ├── ServiceManager.js
│   │   └── BookingManager.js
│   │
│   ├── routes/
│   │   ├── services.router.js
│   │   └── bookings.router.js
│   │
│   ├── app.js
│   └── server.js
│
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

---

# Responsabilidad de los archivos principales

### `src/app.js`

Configura Express, habilita el procesamiento de JSON y conecta los routers:

```js
app.use(express.json());

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
```

### `src/server.js`

Se encarga de iniciar el servidor utilizando el puerto configurado mediante variables de entorno.

### `src/routes/services.router.js`

Define las rutas correspondientes al recurso `services` y las conecta con los controllers.

### `src/routes/bookings.router.js`

Define las rutas correspondientes al recurso `bookings` y las conecta con los controllers.

### `src/controllers/services.controller.js`

Gestiona las solicitudes HTTP relacionadas con `services` y utiliza `ServiceManager` para realizar las operaciones.

### `src/controllers/bookings.controller.js`

Gestiona las solicitudes HTTP relacionadas con `bookings` y utiliza `BookingManager` y `ServiceManager` cuando es necesario.

### `src/managers/ServiceManager.js`

Contiene la lógica de administración de los servicios y la persistencia en `services.json`.

### `src/managers/BookingManager.js`

Contiene la lógica de administración de las reservas y la persistencia en `bookings.json`.

### `src/data/services.json`

Contiene los datos persistidos de los servicios.

### `src/data/bookings.json`

Contiene los datos persistidos de las reservas.

### `src/config/env.config.js`

Carga y valida las variables de entorno utilizadas por el proyecto.

---

# Persistencia con FileSystem

La información se almacena en archivos JSON utilizando `fs/promises`.

El ciclo de persistencia consiste en:

1. Leer el archivo JSON.
2. Convertir el contenido mediante `JSON.parse()`.
3. Realizar la operación correspondiente.
4. Convertir nuevamente los datos mediante `JSON.stringify()`.
5. Guardar los cambios en el archivo.

Los servicios y las reservas mantienen su información aunque el servidor se reinicie.

---

# Variables de entorno

El proyecto utiliza las siguientes variables:

```env
PORT=8080
NODE_ENV=development
```

Para trabajar localmente se debe crear un archivo `.env` en la raíz del proyecto.

El archivo `.env` está incluido en `.gitignore` y no debe subirse al repositorio.

También se incluye `.env.example` como plantilla de las variables necesarias para ejecutar el proyecto.

---

# Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` tomando como referencia `.env.example`:

```env
PORT=8080
NODE_ENV=development
```

---

# Ejecución

Para iniciar el servidor:

```bash
npm start
```

El comando utiliza el script definido en `package.json`:

```json
"start": "node src/server.js"
```

Si todo está correctamente configurado, se mostrará:

```text
Variables de entorno cargadas correctamente.
Servidor escuchando en el puerto 8080
```

La API estará disponible en:

```text
http://localhost:8080
```

---

# Códigos de estado HTTP

La API utiliza principalmente los siguientes códigos:

* `200` → operación realizada correctamente.
* `201` → recurso creado correctamente.
* `400` → datos incorrectos o campos obligatorios faltantes.
* `404` → recurso no encontrado.

---

# Pruebas realizadas

Antes de la entrega se verificaron los endpoints principales de la API.

### Services

* Obtener todos los servicios.
* Obtener un servicio por ID.
* Filtrar por categoría.
* Filtrar por disponibilidad.
* Crear un servicio.
* Actualizar un servicio.
* Eliminar un servicio.
* Verificar que un servicio eliminado ya no pueda ser encontrado.

### Bookings

* Crear una reserva.
* Obtener una reserva por ID.
* Agregar un servicio a una reserva.
* Verificar el incremento de `quantity` al agregar nuevamente el mismo servicio.
* Verificar que no se pueda asociar un servicio inexistente.
* Verificar que no se pueda modificar una reserva inexistente.

También se verificó que, después de reorganizar la aplicación, los endpoints mantuvieran su funcionamiento y sus URLs originales.

Los datos utilizados durante las pruebas temporales fueron eliminados o restaurados para mantener los archivos JSON de la entrega en su estado correspondiente.

---

# Ejemplos de uso

### Obtener todos los servicios

```http
GET http://localhost:8080/api/services
```

### Obtener un servicio por ID

```http
GET http://localhost:8080/api/services/2
```

### Filtrar por categoría

```http
GET http://localhost:8080/api/services?category=Barbería
```

### Filtrar por disponibilidad

```http
GET http://localhost:8080/api/services?available=true
```

### Obtener una reserva

```http
GET http://localhost:8080/api/bookings/1
```

### Agregar un servicio a una reserva

```http
POST http://localhost:8080/api/bookings/1/services/2
```

---

# Estado del proyecto

Esta versión implementa una API REST funcional para la gestión de **servicios y reservas**, utilizando **Node.js, Express y FileSystem**.

La estructura de la aplicación fue reorganizada separando:

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

Los routers se encargan únicamente de definir las rutas y conectarlas con los controllers.

Los controllers gestionan las solicitudes y respuestas HTTP.

Los managers contienen la lógica de negocio y la persistencia de datos.

Los endpoints existentes se mantienen sin cambios, preservando el comportamiento externo de la API.

Esta organización permite continuar evolucionando el proyecto en futuras etapas del curso hacia una estructura con repositorios, DAO, validaciones y persistencia mediante MongoDB/Mongoose.
