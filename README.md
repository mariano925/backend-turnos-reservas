
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

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Lista los servicios |
| GET | `/api/services/:sid` | Obtiene un servicio por ID |
| POST | `/api/services` | Crea un servicio |
| PUT | `/api/services/:sid` | Actualiza un servicio |
| DELETE | `/api/services/:sid` | Elimina un servicio |

La API permite filtrar los servicios mediante los parámetros `category` y `available`.

## Reservas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva |
| GET | `/api/bookings/:bid` | Obtiene una reserva por ID |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |

Los servicios asociados a una reserva utilizan referencias `ObjectId` y almacenan la cantidad solicitada de cada servicio.

## Modelos

El proyecto cuenta con tres modelos de Mongoose:

- `service.model.js`: define los servicios disponibles.
- `booking.model.js`: define las reservas y sus servicios asociados.
- `message.model.js`: queda preparado para futuras funcionalidades.

## Validaciones de datos

Los modelos utilizan validaciones de Mongoose para evitar que se guarden datos inválidos.

### Servicios

- La duración es obligatoria y debe estar entre 5 y 240 minutos.
- El precio es obligatorio y debe estar entre 0 y 1.000.000.
- Los campos requeridos deben estar presentes al crear un servicio.
- El campo `available` representa la disponibilidad del servicio.

### Reservas

- El nombre del cliente, el correo electrónico, la fecha, la hora y el estado son obligatorios.
- El correo electrónico se normaliza a minúsculas, elimina espacios en los extremos y valida su formato.
- La fecha debe respetar el formato `YYYY-MM-DD` y corresponder a un día real del calendario.
- La hora debe respetar el formato de 24 horas `HH:mm`.
- El estado debe ser uno de los valores permitidos: `pending`, `confirmed` o `cancelled`.
- La cantidad de cada servicio asociado debe estar entre 1 y 10.

### Formato de fecha y hora

Los campos `date` y `time` se almacenan como cadenas de texto (`String`).

La fecha representa un día del calendario y la hora representa el horario local elegido para el turno. Esta decisión evita conversiones de zona horaria innecesarias. Ambos campos se validan antes de aceptar los datos.

### Actualización de registros

Las operaciones de actualización ejecutan las validaciones del esquema mediante la opción `runValidators: true`.

La API distingue entre datos inválidos, recursos inexistentes y errores inesperados del servidor mediante los códigos HTTP correspondientes:

- `400 Bad Request`: datos o identificadores inválidos.
- `404 Not Found`: recurso inexistente.
- `500 Internal Server Error`: error inesperado del servidor.

## Persistencia

La persistencia fue migrada de **FileSystem/JSON a MongoDB Atlas**, utilizando Mongoose para definir los modelos y gestionar las operaciones con la base de datos.

Los archivos JSON de la etapa anterior fueron eliminados.

## Variables de entorno

El proyecto utiliza los archivos `.env` y `.env.example` para configurar las variables de entorno.

Variables utilizadas:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/Backend1-Mariano
```

La URI de conexión mostrada es un ejemplo ilustrativo. Debe reemplazarse por la correspondiente configuración de MongoDB Atlas.

El archivo `.env` contiene la configuración local y no debe incluirse en el repositorio. El archivo `.env.example` permite identificar las variables necesarias sin exponer credenciales reales.

## Instalación y ejecución

Clonar el repositorio y acceder al directorio del proyecto.

Instalar las dependencias:

```bash
npm install
```

Configurar las variables de entorno en el archivo `.env`.

Iniciar la API:

```bash
npm start
```

La API se ejecuta por defecto en:

`http://localhost:8080`

## Tecnologías

- Node.js
- Express
- ECMAScript Modules (ESM)
- dotenv
- Mongoose
- MongoDB Atlas
