# Sistema Backend de Turnos y Reservas

API REST desarrollada con Node.js y Express para gestionar servicios de barbería y reservas, utilizando MongoDB Atlas como persistencia principal. El proyecto incorpora validaciones con Zod, vistas renderizadas con Handlebars y actualizaciones en tiempo real con Socket.IO.

## Tecnologías utilizadas

- Node.js y Express.
- ECMAScript Modules (ESM).
- MongoDB Atlas y Mongoose.
- Zod para validar los datos de entrada.
- Express Handlebars para renderizar vistas HTML.
- Socket.IO para comunicar cambios en tiempo real.
- dotenv para gestionar variables de entorno.

## Arquitectura

El proyecto utiliza una arquitectura en capas para separar las responsabilidades:

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
- **Model:** define los esquemas y las validaciones de MongoDB.

## Requisitos previos

- Node.js y npm instalados.
- Una cuenta y un clúster configurado en MongoDB Atlas.
- Una URI de conexión válida, con el usuario y los permisos necesarios para acceder a la base de datos.

## Instalación

Cloná el repositorio y entrá en la carpeta del proyecto:

```bash
git clone https://github.com/mariano925/backend-turnos-reservas.git
cd backend-turnos-reservas
```

Instalá las dependencias:

```bash
npm install
```

## Variables de entorno

Creá el archivo `.env` a partir de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Editá `.env` con la configuración local:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/Backend1-Mariano
```

Reemplazá los valores de ejemplo de `MONGODB_URI` por la URI de tu clúster de MongoDB Atlas. La URI mostrada arriba es ficticia y no permite conectarse a una base de datos real.

Verificá que MongoDB Atlas tenga configurados el usuario de base de datos y los permisos de acceso de red necesarios.

**Importante:** no publiques el archivo `.env`, contraseñas, URI reales ni otras credenciales. El repositorio incluye `.env.example` para documentar las variables necesarias sin exponer datos sensibles.

## Ejecución

Iniciá el servidor con:

```bash
npm start
```

La aplicación se conecta a MongoDB Atlas antes de comenzar a escuchar solicitudes. Con la configuración predeterminada, el servidor queda disponible en:

```text
http://localhost:8080
```

Si la conexión falla, verificá las variables de entorno y la configuración de acceso de MongoDB Atlas.

## API REST

### Servicios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Lista servicios con filtros, ordenamiento y paginación. |
| GET | `/api/services/:sid` | Consulta un servicio por ID. |
| POST | `/api/services` | Crea un servicio. |
| PUT | `/api/services/:sid` | Actualiza uno o varios campos de un servicio. |
| DELETE | `/api/services/:sid` | Elimina un servicio. |

### Filtros, ordenamiento y paginación

El endpoint `GET /api/services` admite los siguientes parámetros:

| Parámetro | Descripción |
|---|---|
| `category` | Filtra por categoría. |
| `available` | Filtra por disponibilidad: `true` o `false`. |
| `page` | Selecciona la página. |
| `limit` | Define la cantidad de resultados por página, entre 1 y 100. |
| `sortBy` | Ordena por `name`, `price`, `duration` o `category`. |
| `order` | Orden ascendente (`asc`) o descendente (`desc`). |

Ejemplo:

```http
GET /api/services?category=Barberia&available=true&page=1&limit=5&sortBy=price&order=asc
```

La respuesta paginada incluye `services`, `total`, `page`, `limit`, `totalPages`, `hasPrevPage` y `hasNextPage`.

Los parámetros inválidos generan una respuesta HTTP `400 Bad Request`.

### Crear un servicio

Endpoint:

```http
POST /api/services
Content-Type: application/json
```

Cuerpo de ejemplo:

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

La creación requiere nombre, descripción, duración, precio, categoría y disponibilidad.

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

El identificador debe reemplazarse por el ID real del servicio. La actualización admite campos parciales y no permite un cuerpo vacío.

### Reservas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva sin servicios asociados. |
| GET | `/api/bookings/:bid` | Consulta una reserva y recupera los datos completos de sus servicios mediante `populate`. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio existente a una reserva. |

### Crear una reserva

Endpoint:

```http
POST /api/bookings
Content-Type: application/json
```

Cuerpo de ejemplo:

```json
{
  "clientName": "Juan Perez",
  "clientEmail": "juan@example.com",
  "date": "2026-11-15",
  "time": "10:00",
  "status": "pending"
}
```

La reserva se crea inicialmente sin servicios. Los servicios se asocian mediante el endpoint específico.

### Asociar un servicio a una reserva

Endpoint:

```http
POST /api/bookings/ID_DE_LA_RESERVA/services/ID_DEL_SERVICIO
```

Reemplazá ambos identificadores por los IDs existentes. La operación agrega una unidad del servicio; si el servicio ya estaba asociado, incrementa su cantidad, respetando el máximo configurado.

## Validaciones con Zod y Mongoose

El middleware reutilizable de validación está ubicado en `src/middlewares/validate.middleware.js`. Los esquemas se encuentran en `src/validations/`.

**Servicios:**

- Nombre, descripción y categoría obligatorios y no vacíos.
- Duración entre 5 y 240 minutos.
- Precio entre 0 y 1.000.000.
- Disponibilidad de tipo booleano.
- Actualizaciones parciales, con al menos un campo válido y sin propiedades adicionales.

**Reservas:**

- Nombre y correo electrónico válidos.
- Fecha real con formato `YYYY-MM-DD`.
- Hora con formato de 24 horas `HH:mm`.
- Estado restringido a `pending`, `confirmed` o `cancelled`.
- Identificadores con formato ObjectId validados en la operación de asociación de servicios.

Las validaciones de Zod se complementan con las restricciones de los esquemas de Mongoose.

## Relaciones y populate

Las reservas guardan referencias `ObjectId` a los documentos de servicios, junto con la cantidad solicitada. No almacenan una copia completa del servicio como dato embebido.

Al consultar una reserva mediante `GET /api/bookings/:bid`, el DAO utiliza:

```javascript
.populate("services.service")
```

De esta manera, la respuesta incluye los datos de la reserva y los documentos de los servicios relacionados, junto con sus cantidades.

## Vistas con Handlebars

Las vistas utilizan datos recuperados de MongoDB a través de los servicios y repositorios.

| Ruta | Descripción |
|---|---|
| `/views/services` | Muestra los servicios, precios, duración y disponibilidad. |
| `/views/availability` | Muestra las reservas y sus servicios asociados. |

Las páginas comparten el diseño principal definido en `src/views/layouts/main.handlebars`.

## Comunicación en tiempo real con Socket.IO

El servidor utiliza Socket.IO para notificar cambios en los servicios.

Cuando se crea, actualiza o elimina un servicio mediante la API, el servidor emite el evento `servicesUpdated`. El archivo `public/js/socket.js` escucha ese evento y actualiza la lista de servicios sin recargar la página.

La funcionalidad fue comprobada en el navegador mediante operaciones de creación y eliminación de un servicio temporal.

## Pruebas manuales

Las operaciones pueden probarse con Postman, Thunder Client o PowerShell.

Ejemplos de consultas:

```powershell
# Listar servicios
Invoke-RestMethod "http://localhost:8080/api/services"

# Consultar un servicio existente
Invoke-RestMethod "http://localhost:8080/api/services/ID_DEL_SERVICIO"

# Consultar una reserva y sus servicios asociados
Invoke-RestMethod "http://localhost:8080/api/bookings/ID_DE_LA_RESERVA"
```

También conviene probar la creación, actualización y eliminación de servicios, los filtros de `GET /api/services`, la asociación de servicios a reservas y los casos de error.

Entre los errores contemplados se encuentran los datos incompletos, los identificadores mal formados y los recursos inexistentes.

## Códigos de respuesta HTTP

| Código | Significado |
|---|---|
| `200 OK` | Operación realizada correctamente. |
| `201 Created` | Recurso creado. |
| `400 Bad Request` | Datos o identificadores inválidos. |
| `404 Not Found` | Recurso inexistente. |
| `500 Internal Server Error` | Error inesperado del servidor. |

## Seguridad y repositorio

El repositorio debe incluir el código fuente, `package.json`, `package-lock.json`, `README.md`, `.gitignore` y `.env.example`.

No se deben subir `.env`, `node_modules`, credenciales reales ni archivos temporales.

## Mejoras futuras

Entre las posibles mejoras se encuentran ampliar las operaciones de gestión de reservas, incorporar pruebas automatizadas y agregar controles adicionales para administrar la disponibilidad de los turnos.