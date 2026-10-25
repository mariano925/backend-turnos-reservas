# Sistema Backend de Turnos y Reservas

## Descripción

API REST desarrollada con Node.js y Express para gestionar los servicios de una barbería y sus reservas.

El proyecto utiliza MongoDB Atlas como base de datos y Mongoose para definir los modelos y realizar las operaciones de persistencia. También incorpora validaciones con Zod, arquitectura en capas, vistas con Express Handlebars y actualizaciones en tiempo real mediante Socket.IO.

El sistema permite administrar servicios, crear y consultar reservas, asociar servicios existentes y actualizar las cantidades solicitadas. Las relaciones entre reservas y servicios se almacenan mediante referencias `ObjectId`.

## Tecnologías utilizadas

- **Node.js y Express:** ejecución del servidor y definición de la API REST.
- **ECMAScript Modules (ESM):** organización e importación de módulos JavaScript.
- **MongoDB Atlas:** persistencia de los datos.
- **Mongoose:** modelos, esquemas y operaciones sobre MongoDB.
- **Zod:** validación de los datos recibidos por la API.
- **Express Handlebars:** generación de vistas HTML.
- **Socket.IO:** comunicación en tiempo real entre el servidor y los navegadores.
- **dotenv:** lectura de variables de entorno.

## Arquitectura del proyecto

El proyecto utiliza una arquitectura en capas para separar las solicitudes HTTP, la lógica de negocio y el acceso a los datos.

```text
Cliente HTTP o navegador
          |
          v
        Router
          |
          v
       Controller
          |
          v
        Service
          |
          v
      Repository
          |
          v
          DAO
          |
          v
       Mongoose
          |
          v
     MongoDB Atlas
```

Responsabilidades de cada capa:

- **Router:** define los endpoints y aplica los middlewares de validación.
- **Controller:** recibe las solicitudes HTTP y devuelve las respuestas correspondientes.
- **Service:** implementa la lógica de negocio y verifica las condiciones necesarias para las operaciones.
- **Repository:** actúa como intermediario entre la lógica de negocio y el acceso a los datos.
- **DAO:** ejecuta las consultas y operaciones de persistencia mediante Mongoose.
- **Model:** define la estructura de los documentos y las reglas de validación del esquema.

Las vistas recuperan información a través de los servicios y repositorios, manteniendo separadas las responsabilidades.

## Estructura de carpetas

```text
Backend1-Mariano/
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── bookings.js
│       ├── services.js
│       └── socket.js
├── src/
│   ├── config/
│   │   ├── database.config.js
│   │   └── env.config.js
│   ├── controllers/
│   │   ├── bookings.controller.js
│   │   ├── services.controller.js
│   │   └── views.controller.js
│   ├── dao/
│   │   ├── bookings.dao.js
│   │   └── services.dao.js
│   ├── middlewares/
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── booking.model.js
│   │   ├── message.model.js
│   │   └── service.model.js
│   ├── repositories/
│   │   ├── bookings.repository.js
│   │   └── services.repository.js
│   ├── routes/
│   │   ├── bookings.router.js
│   │   ├── services.router.js
│   │   └── views.router.js
│   ├── services/
│   │   ├── bookings.service.js
│   │   └── services.service.js
│   ├── validations/
│   │   ├── booking.schema.js
│   │   └── service.schema.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── availability.handlebars
│   │   └── services.handlebars
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

El archivo `.env` y la carpeta `node_modules` se utilizan localmente y no deben publicarse en el repositorio.

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm instalados.
- Una cuenta y un clúster configurado en MongoDB Atlas.
- Una URI de conexión válida.
- Un usuario de base de datos con permisos suficientes.
- Acceso de red configurado en MongoDB Atlas.

## Instalación

Cloná el repositorio y entrá en su carpeta:

```bash
git clone https://github.com/mariano925/backend-turnos-reservas.git
cd backend-turnos-reservas
```

Instalá las dependencias:

```bash
npm install
```

## Variables de entorno

La configuración se administra mediante variables de entorno. El archivo `.env` se utiliza localmente y no debe publicarse en el repositorio.

Creá tu archivo `.env` a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

Configurá las variables necesarias:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/Backend1-Mariano
```

La URI anterior es ficticia. Reemplazala por la URI real de tu clúster de MongoDB Atlas y mantené las credenciales únicamente en tu archivo `.env` local.

El proyecto utiliza `PORT` y `MONGODB_URI` para configurar el servidor y la conexión con la base de datos. `NODE_ENV` identifica el entorno de ejecución.

**Importante:** no publiques contraseñas, URI reales, tokens ni otros datos sensibles. El archivo `.env.example` debe orientar la configuración sin incluir credenciales reales.

## Ejecución

Iniciá el servidor con:

```bash
npm start
```

La aplicación establece la conexión con MongoDB Atlas antes de comenzar a escuchar solicitudes.

Con el puerto predeterminado, el servidor queda disponible en:

```text
http://localhost:8080
```

Si el servidor no puede conectarse a MongoDB Atlas, verificá la URI, el usuario de base de datos y los permisos de red configurados en Atlas.

## API REST

### Servicios

El endpoint `GET /api/services` permite consultar los servicios registrados y aplicar filtros, paginación y ordenamiento.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Lista servicios con filtros, paginación y ordenamiento. |
| GET | `/api/services/:sid` | Consulta un servicio por su identificador. |
| POST | `/api/services` | Crea un servicio. |
| PUT | `/api/services/:sid` | Actualiza uno o varios campos de un servicio. |
| DELETE | `/api/services/:sid` | Elimina un servicio. |

### Filtros, paginación y ordenamiento

El endpoint `GET /api/services` acepta los siguientes parámetros:

| Parámetro | Descripción |
|---|---|
| `category` | Filtra por categoría. |
| `available` | Filtra por disponibilidad: `true` o `false`. |
| `page` | Indica la página solicitada. |
| `limit` | Cantidad de resultados por página, entre 1 y 100. |
| `sortBy` | Campo de ordenamiento: `name`, `price`, `duration` o `category`. |
| `order` | Orden ascendente (`asc`) o descendente (`desc`). |

Ejemplo de consulta:

```http
GET /api/services?category=Barberia&available=true&page=1&limit=5&sortBy=price&order=asc
```

La respuesta incluye el listado `services` y los metadatos `total`, `page`, `limit`, `totalPages`, `hasPrevPage` y `hasNextPage`.

La paginación se implementa mediante `skip` y `limit` de Mongoose. El ordenamiento utiliza una lista permitida de campos.

### Crear un servicio

Endpoint:

```http
POST /api/services
Content-Type: application/json
```

Ejemplo de cuerpo JSON:

```json
{
  "name": "Corte clásico",
  "description": "Corte de cabello tradicional",
  "duration": 30,
  "price": 5000,
  "category": "Peluqueria",
  "available": true
}
```

La creación requiere nombre, descripción, duración, precio, categoría y disponibilidad, de acuerdo con el esquema de validación.

### Actualizar un servicio

Endpoint:

```http
PUT /api/services/ID_DEL_SERVICIO
Content-Type: application/json
```

Ejemplo de actualización parcial:

```json
{
  "price": 5500
}
```

Reemplazá `ID_DEL_SERVICIO` por el identificador de un servicio existente. La actualización permite enviar uno o varios campos válidos y rechaza un cuerpo vacío.

### Eliminar un servicio

Endpoint:

```http
DELETE /api/services/ID_DEL_SERVICIO
```

La respuesta devuelve el documento eliminado. Si el servicio no existe, la API responde con `404 Not Found`.

## Reservas

Las reservas permiten registrar los datos del cliente, la fecha, la hora y el estado. Los servicios se asocian después de crear la reserva.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva sin servicios asociados. |
| GET | `/api/bookings/:bid` | Consulta una reserva con los datos de sus servicios mediante `populate`. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio o incrementa su cantidad. |
| PATCH | `/api/bookings/:bid/services/:sid` | Establece una cantidad específica para un servicio asociado. |
| DELETE | `/api/bookings/:bid/services/:sid` | Elimina un servicio de una reserva. |
| DELETE | `/api/bookings/:bid/services` | Quita todos los servicios asociados y conserva la reserva. |
| DELETE | `/api/bookings/:bid` | Elimina una reserva completa. |

### Crear una reserva

Endpoint:

```http
POST /api/bookings
Content-Type: application/json
```

Ejemplo de cuerpo JSON:

```json
{
  "clientName": "Juan Perez",
  "clientEmail": "juan@example.com",
  "date": "2026-11-15",
  "time": "10:00",
  "status": "pending"
}
```

La reserva se crea inicialmente con `services: []`.

### Asociar un servicio a una reserva

Endpoint:

```http
POST /api/bookings/ID_DE_LA_RESERVA/services/ID_DEL_SERVICIO
```

Reemplazá ambos identificadores por los IDs reales. La operación agrega una unidad del servicio. Si el servicio ya está asociado a la reserva, incrementa su cantidad.

La cantidad permitida es de 1 a 10 unidades por servicio asociado.

### Establecer una cantidad específica

Endpoint:

```http
PATCH /api/bookings/ID_DE_LA_RESERVA/services/ID_DEL_SERVICIO
Content-Type: application/json
```

Ejemplo de cuerpo JSON:

```json
{
  "quantity": 3
}
```

La cantidad debe ser un entero entre 1 y 10. El servicio debe estar asociado a la reserva.

### Eliminar un servicio de una reserva

Endpoint:

```http
DELETE /api/bookings/ID_DE_LA_RESERVA/services/ID_DEL_SERVICIO
```

Esta operación elimina la asociación del servicio con la reserva, pero no elimina el servicio del catálogo.

Si el servicio no está asociado a esa reserva, la API responde con `404 Not Found`.

### Vaciar los servicios de una reserva

Endpoint:

```http
DELETE /api/bookings/ID_DE_LA_RESERVA/services
```

Elimina todas las asociaciones de servicios. La reserva permanece registrada con su información de cliente, fecha, hora y estado.

### Eliminar una reserva

Endpoint:

```http
DELETE /api/bookings/ID_DE_LA_RESERVA
```

Elimina el documento de la reserva. La respuesta devuelve el documento eliminado; si la reserva no existe, responde con `404 Not Found`.

## Validaciones con Zod y Mongoose

Las validaciones de entrada se definen en `src/validations/`. El middleware reutilizable se encuentra en `src/middlewares/validate.middleware.js`.

El middleware utiliza `safeParse()` para comprobar los datos antes de ejecutar el controlador. Si la validación falla, la API devuelve `400 Bad Request`.

### Validaciones de servicios

- Nombre, descripción y categoría obligatorios y no vacíos.
- Duración dentro del rango establecido por el esquema.
- Precio dentro del rango establecido por el esquema.
- Disponibilidad de tipo booleano.
- Actualizaciones parciales con al menos un campo válido.
- Rechazo de propiedades no permitidas cuando lo establece el esquema.

### Validaciones de reservas

- Nombre del cliente obligatorio.
- Correo electrónico con formato válido.
- Fecha real con formato `YYYY-MM-DD`.
- Hora con formato de 24 horas `HH:mm`.
- Estado limitado a `pending`, `confirmed` o `cancelled`.
- Identificadores de reservas y servicios validados en las operaciones correspondientes.
- Cantidad entera entre 1 y 10 al actualizar una asociación.

Las reglas de Zod se complementan con las validaciones de los modelos de Mongoose. Las operaciones de actualización utilizan `runValidators: true` para aplicar las validaciones del esquema cuando corresponde.

Zod comprueba la estructura y los valores recibidos. La capa de servicio verifica las condiciones de negocio, como la existencia de la reserva y del servicio, y la validez de la asociación solicitada.

## Relaciones entre reservas y servicios

La relación entre reservas y servicios se implementa mediante referencias `ObjectId`.

Cada elemento del array `services` de una reserva contiene:

- `service`: referencia al documento existente en la colección de servicios.
- `quantity`: cantidad solicitada de ese servicio.

La reserva no guarda una copia completa del servicio. Los datos principales permanecen en el documento del servicio.

### Uso de populate

El DAO de reservas utiliza:

```javascript
.populate("services.service")
```

Esto permite que `GET /api/bookings/:bid` devuelva los datos de cada servicio relacionado junto con su cantidad.

La respuesta puede incluir el nombre, la descripción, la duración, el precio y la categoría del servicio asociado. Así, el cliente de la API puede consultar una reserva sin realizar manualmente una solicitud independiente por cada servicio.

## Vistas con Handlebars

El proyecto incorpora vistas HTML renderizadas con Express Handlebars.

| Ruta | Descripción |
|---|---|
| `/views/services` | Muestra los servicios y permite crearlos, editarlos y eliminarlos desde la interfaz. |
| `/views/availability` | Muestra las reservas y permite crearlas, asociar servicios, actualizar cantidades y administrar las asociaciones. |

La pantalla de reservas permite quitar un servicio, quitar todas las asociaciones o eliminar una reserva completa.

Las vistas utilizan información recuperada desde MongoDB mediante las capas de servicio y repositorio.

El diseño compartido se encuentra en `src/views/layouts/main.handlebars`. Los estilos están en `public/css/styles.css`.

Los archivos JavaScript de las interfaces son:

- `public/js/services.js`: gestiona las operaciones de servicios desde la pantalla.
- `public/js/bookings.js`: gestiona las operaciones de reservas desde la pantalla.
- `public/js/socket.js`: recibe las actualizaciones de servicios en tiempo real.

## Comunicación en tiempo real con Socket.IO

Socket.IO permite comunicar los cambios realizados sobre los servicios a los navegadores conectados.

Después de crear, actualizar o eliminar un servicio mediante las operaciones correspondientes de la aplicación, el servidor emite el evento `servicesUpdated`. El archivo `public/js/socket.js` escucha ese evento y actualiza la lista de servicios sin recargar manualmente la página.

La funcionalidad se comprobó en el navegador mediante la creación y eliminación de un servicio temporal.

## Pruebas manuales

Los endpoints pueden probarse con Postman, Thunder Client o PowerShell. Para las pruebas de escritura, conviene utilizar datos temporales y eliminar los registros creados al terminar.

Ejemplos de consultas en PowerShell:

```powershell
# Listar servicios
Invoke-RestMethod "http://localhost:8080/api/services"

# Consultar un servicio existente
Invoke-RestMethod "http://localhost:8080/api/services/ID_DEL_SERVICIO"

# Consultar una reserva con sus servicios asociados
Invoke-RestMethod "http://localhost:8080/api/bookings/ID_DE_LA_RESERVA"
```

Para comprobar las operaciones de escritura, se pueden utilizar `POST`, `PUT`, `PATCH` y `DELETE`, según el endpoint.

También deben verificarse los casos de error, como los datos incompletos, los identificadores mal formados y los recursos inexistentes.

## Códigos de respuesta HTTP

| Código | Significado |
|---|---|
| `200 OK` | Operación realizada correctamente. |
| `201 Created` | Recurso creado correctamente. |
| `400 Bad Request` | Datos inválidos o identificadores con formato incorrecto. |
| `404 Not Found` | Recurso inexistente o servicio no asociado a la reserva. |
| `500 Internal Server Error` | Error inesperado del servidor. |

Los códigos concretos dependen del endpoint y del tipo de operación.

## Seguridad y repositorio

El repositorio incluye el código fuente, `package.json`, `package-lock.json`, `README.md`, `.gitignore` y `.env.example`.

No deben publicarse:

- `.env` con la configuración local y las credenciales.
- `node_modules`.
- Contraseñas, URI reales, tokens u otros datos sensibles.
- Archivos temporales que no formen parte del proyecto.

El archivo `.env.example` sirve como guía para configurar el proyecto en otro entorno sin exponer credenciales reales.

## Posibles mejoras futuras

Como mejoras futuras se podrían incorporar pruebas automatizadas, controles adicionales sobre la disponibilidad horaria de los turnos y otras funcionalidades para administrar las reservas.