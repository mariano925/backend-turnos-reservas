# Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, ESM, dotenv y Mongoose** para gestionar servicios y reservas mediante **MongoDB Atlas**.

## Arquitectura

El proyecto utiliza una arquitectura en capas:

```text
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
Mongoose
   ↓
MongoDB Atlas
```

Cada capa tiene una responsabilidad específica, separando la lógica de negocio de la persistencia.

## Estructura

```text
src/
├── config/
├── controllers/
├── dao/
├── models/
├── repositories/
├── routes/
├── services/
├── app.js
└── server.js
```

## Servicios

| Método | Ruta                 | Descripción           |
| ------ | -------------------- | --------------------- |
| GET    | `/api/services`      | Lista servicios       |
| GET    | `/api/services/:sid` | Obtiene un servicio   |
| POST   | `/api/services`      | Crea un servicio      |
| PUT    | `/api/services/:sid` | Actualiza un servicio |
| DELETE | `/api/services/:sid` | Elimina un servicio   |

Permite filtrar por `category` y `available`.

## Reservas

| Método | Ruta                               | Descripción         |
| ------ | ---------------------------------- | ------------------- |
| POST   | `/api/bookings`                    | Crea una reserva    |
| GET    | `/api/bookings/:bid`               | Obtiene una reserva |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio  |

Los servicios asociados a una reserva utilizan referencias `ObjectId` y almacenan su cantidad.

## Modelos

El proyecto cuenta con tres modelos de Mongoose:

* `service.model.js`
* `booking.model.js`
* `message.model.js`

El modelo `Message` queda preparado para futuras funcionalidades.

## Persistencia

La persistencia fue migrada de **FileSystem/JSON a MongoDB Atlas** utilizando Mongoose.

Los archivos JSON de la etapa anterior fueron eliminados.

## Variables de entorno

El proyecto utiliza `.env` y `.env.example`.

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/Backend1-Mariano
```

El archivo `.env` no se incluye en el repositorio.

## Instalación

```bash
npm install
npm start
```

La API se ejecuta por defecto en:

```text
http://localhost:8080
```

## Tecnologías

* Node.js
* Express
* ESM
* dotenv
* Mongoose
* MongoDB Atlas
