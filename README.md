# Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, ECMAScript Modules (ESM), dotenv, Mongoose y Zod** para gestionar servicios y reservas mediante **MongoDB Atlas**.

El proyecto incorpora vistas renderizadas con **Express Handlebars** y comunicación en tiempo real mediante **Socket.IO**, manteniendo una arquitectura en capas que separa las responsabilidades de cada componente.

## Arquitectura

El proyecto utiliza la siguiente estructura:

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

- **Router:** define los endpoints y aplica los middlewares de validación.
- **Controller:** coordina las solicitudes HTTP y las respuestas.
- **Service:** implementa la lógica de negocio.
- **Repository:** centraliza el acceso a los datos.
- **DAO:** ejecuta las operaciones de persistencia mediante Mongoose.

Esta separación facilita el mantenimiento y la organización del código.

## API REST

### Servicios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Lista servicios con filtros, ordenamiento y paginación. |
| GET | `/api/services/:sid` | Obtiene un servicio por su ID. |
| POST | `/api/services` | Crea un servicio. |
| PUT | `/api/services/:sid` | Actualiza un servicio. |
| DELETE | `/api/services/:sid` | Elimina un servicio. |

### Filtros, ordenamiento y paginación

El endpoint `GET /api/services` admite los siguientes parámetros:

- `category`: filtra por categoría.
- `available`: filtra por disponibilidad (`true` o `false`).
- `page`: selecciona la página.
- `limit`: establece la cantidad de resultados por página, entre 1 y 100.
- `sortBy`: permite ordenar por `name`, `price`, `duration` o `category`.
- `order`: establece el orden ascendente (`asc`) o descendente (`desc`).

Ejemplo de consulta:

```http
GET /api/services?category=Barberia&available=true&page=1&limit=5&sortBy=price&order=asc
```

La respuesta incluye el listado de servicios y los metadatos de paginación:

- `total`: cantidad total de resultados que cumplen los filtros.
- `page`: página actual.
- `limit`: límite de resultados por página.
- `totalPages`: cantidad total de páginas.
- `hasPrevPage`: indica si existe una página anterior.
- `hasNextPage`: indica si existe una página siguiente.

Los parámetros inválidos generan una respuesta HTTP `400 Bad Request`.

### Reservas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva. |
| GET | `/api/bookings/:bid` | Obtiene una reserva por su ID. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

Las reservas almacenan referencias `ObjectId` a los servicios asociados y la cantidad solicitada de cada uno. Si se agrega un servicio que ya está asociado, se incrementa su cantidad, respetando el límite establecido.

## Validaciones de datos con Zod

El proyecto utiliza **Zod** para validar los datos recibidos por la API antes de que lleguen a los controladores.

Los esquemas se encuentran en `src/validations/` y el middleware reutilizable en `src/middlewares/validate.middleware.js`.

### Servicios

- Nombre, descripción y categoría obligatorios y no vacíos.
- Duración entre 5 y 240 minutos.
- Precio entre 0 y 1.000.000.
- Disponibilidad de tipo booleano.
- Actualizaciones parciales, con al menos un campo válido y sin propiedades adicionales.

### Reservas

- Nombre del cliente obligatorio.
- Correo electrónico con formato válido.
- Fecha real con formato `YYYY-MM-DD`.
- Hora válida con formato de 24 horas `HH:mm`.
- Estado limitado a `pending`, `confirmed` o `cancelled`.
- Identificadores de reserva y servicio con formato `ObjectId` en la operación de agregar un servicio.

La reserva se crea inicialmente sin servicios asociados; estos se agregan mediante el endpoint correspondiente.

El middleware utiliza `safeParse()` para comprobar los datos. Si la validación falla, responde con HTTP `400 Bad Request` y detiene el procesamiento de la solicitud.

Las validaciones de Zod se complementan con las restricciones de los modelos de Mongoose, incluidas las validaciones ejecutadas durante las actualizaciones.

## Referencias y populate

Los servicios asociados a una reserva se guardan como referencias `ObjectId`, junto con su cantidad.

Para consultar una reserva con sus servicios asociados, se utiliza el siguiente endpoint:

```http
GET /api/bookings/ID_DE_LA_RESERVA
```

El DAO de reservas utiliza `populate("services.service")` para recuperar los documentos de los servicios asociados. La respuesta incluye los datos de la reserva —cliente, correo electrónico, fecha, hora y estado— junto con los datos completos de cada servicio asociado y su cantidad.

## Vistas web con Handlebars

El proyecto utiliza Express Handlebars para renderizar páginas HTML con datos obtenidos desde MongoDB Atlas.

| Ruta | Descripción |
|---|---|
| `/views/services` | Muestra los servicios registrados. |
| `/views/availability` | Muestra las reservas y sus servicios asociados. |

Las vistas reutilizan la arquitectura en capas y consultan los datos almacenados en la base de datos.

## Comunicación en tiempo real con Socket.IO

Socket.IO comunica los cambios de los servicios a los navegadores conectados.

Cuando se crea, actualiza o elimina un servicio mediante la API, el servidor emite el evento `servicesUpdated`. El archivo `public/js/socket.js` escucha ese evento y actualiza el listado sin necesidad de recargar la página.

## Modelos y persistencia

El proyecto utiliza los siguientes modelos de Mongoose:

- `service.model.js`: define los servicios.
- `booking.model.js`: define las reservas y sus servicios asociados.
- `message.model.js`: preparado para futuras funcionalidades.

La persistencia se realiza mediante MongoDB Atlas, reemplazando el almacenamiento anterior basado en archivos JSON.

## Variables de entorno y seguridad

La configuración se gestiona mediante variables de entorno.

- `.env`: contiene la configuración local y no debe publicarse.
- `.env.example`: documenta las variables necesarias sin incluir credenciales reales.

La conexión a MongoDB Atlas se configura mediante `MONGODB_URI`. Las credenciales y demás datos privados deben mantenerse fuera del repositorio.

## Códigos de respuesta HTTP

- `200 OK`: operación realizada correctamente.
- `201 Created`: recurso creado.
- `400 Bad Request`: datos o identificadores inválidos.
- `404 Not Found`: recurso inexistente.
- `500 Internal Server Error`: error inesperado del servidor.

## Tecnologías utilizadas

Node.js · Express · ECMAScript Modules · dotenv · Mongoose · MongoDB Atlas · Zod · Express Handlebars · Socket.IO · HTML · CSS · JavaScript.
