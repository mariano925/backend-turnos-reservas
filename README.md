# Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, ESM, dotenv y FileSystem (`fs/promises`)** para gestionar servicios y reservas mediante archivos JSON.

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
JSON
```

Cada capa tiene una responsabilidad específica y permite mantener separada la lógica de la aplicación de la persistencia.

* **Routes:** definen los endpoints.
* **Controllers:** gestionan las solicitudes y respuestas HTTP.
* **Services:** contienen la lógica de negocio.
* **Repositories:** actúan como intermediarios entre los services y los DAO.
* **DAO:** gestiona directamente la persistencia en archivos JSON.

## Estructura

```text
src/
├── config/
├── controllers/
├── services/
├── repositories/
├── dao/
├── routes/
├── data/
├── app.js
└── server.js
```

## Servicios

Endpoints disponibles:

| Método | Ruta                 | Descripción           |
| ------ | -------------------- | --------------------- |
| GET    | `/api/services`      | Lista servicios       |
| GET    | `/api/services/:sid` | Obtiene un servicio   |
| POST   | `/api/services`      | Crea un servicio      |
| PUT    | `/api/services/:sid` | Actualiza un servicio |
| DELETE | `/api/services/:sid` | Elimina un servicio   |

También permite filtrar servicios mediante `category` y `available`.

## Reservas

Endpoints disponibles:

| Método | Ruta                               | Descripción         |
| ------ | ---------------------------------- | ------------------- |
| POST   | `/api/bookings`                    | Crea una reserva    |
| GET    | `/api/bookings/:bid`               | Obtiene una reserva |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio  |

Al agregar un servicio que ya existe en una reserva, se incrementa su cantidad.

## Persistencia

Los datos se almacenan en:

```text
src/data/services.json
src/data/bookings.json
```

La lectura y escritura de los archivos se realiza desde la capa DAO mediante `fs/promises`.

## Variables de entorno

El proyecto utiliza un archivo `.env` basado en `.env.example`.

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no se incluye en el repositorio.

## Instalación

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
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
* FileSystem
* JSON
* API REST

## Estado del proyecto

API REST refactorizada con arquitectura de **Services, Repository y DAO**, manteniendo los endpoints existentes y separando la lógica de negocio de la persistencia.
