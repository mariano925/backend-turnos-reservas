# Backend de Turnos y Reservas

API REST desarrollada con **Node.js, Express, ECMAScript Modules (ESM), dotenv y Mongoose** para gestionar servicios y reservas mediante **MongoDB Atlas**.

El proyecto incorpora vistas renderizadas con **Express Handlebars** y comunicación en tiempo real con **Socket.io**, manteniendo la API REST y la arquitectura en capas.

## Arquitectura

El proyecto utiliza una arquitectura en capas para separar las responsabilidades de cada componente:

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

Cada capa tiene una responsabilidad específica:

- **Router:** define las rutas y los endpoints disponibles.
- **Controller:** recibe las solicitudes HTTP y coordina las respuestas.
- **Service:** gestiona la lógica de negocio.
- **Repository:** centraliza el acceso a los datos desde la capa de servicios.
- **DAO:** implementa las operaciones de persistencia.
- **Mongoose:** define los modelos y permite interactuar con MongoDB Atlas.

Las vistas web reutilizan las capas de servicios y repositorios para obtener los datos que se muestran en las plantillas.

Socket.io permite comunicar al navegador los cambios realizados en los servicios, sin necesidad de recargar la página.

## Estructura del proyecto

```text
Backend1-Mariano/
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
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

## API REST

### Servicios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Lista los servicios. |
| GET | `/api/services/:sid` | Obtiene un servicio por ID. |
| POST | `/api/services` | Crea un servicio. |
| PUT | `/api/services/:sid` | Actualiza un servicio. |
| DELETE | `/api/services/:sid` | Elimina un servicio. |

La API permite filtrar los servicios mediante los parámetros `category` y `available`.

### Reservas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva. |
| GET | `/api/bookings/:bid` | Obtiene una reserva por ID. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

Los servicios asociados a una reserva utilizan referencias `ObjectId` y almacenan la cantidad solicitada de cada servicio.

## Vistas web con Handlebars

El proyecto incorpora **Express Handlebars** como motor de plantillas para renderizar páginas HTML desde el servidor.

Las vistas consultan los datos reales almacenados en MongoDB Atlas mediante la arquitectura en capas.

### Rutas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/views/services` | Muestra los servicios registrados. |
| GET | `/views/availability` | Muestra las reservas y sus servicios asociados. |

### Vista de servicios

La vista `/views/services` muestra la información de los servicios registrados:

- Nombre.
- Descripción.
- Duración.
- Precio.
- Categoría.
- Disponibilidad.

### Vista de reservas

La vista `/views/availability` muestra la información de las reservas:

- Nombre del cliente.
- Correo electrónico.
- Fecha y hora del turno.
- Estado de la reserva.
- Servicios asociados y sus cantidades.

Los servicios asociados se obtienen mediante referencias de Mongoose y se incorporan a las consultas para mostrar sus datos en la vista.

Las plantillas utilizan los datos obtenidos desde la base de datos, sin depender de registros escritos directamente en el HTML.

## Comunicación en tiempo real con Socket.io

El proyecto utiliza **Socket.io** para comunicar los cambios realizados en los servicios entre el servidor y los navegadores conectados.

Cuando se crea, actualiza o elimina un servicio mediante la API REST, el servidor obtiene la lista actualizada y emite el evento `servicesUpdated`.

El archivo `public/js/socket.js` escucha este evento y actualiza la lista de servicios mostrada en el navegador, sin necesidad de recargar la página.

### Flujo de actualización

```text
Solicitud HTTP
      ↓
Controller de servicios
      ↓
Service → Repository → DAO
      ↓
MongoDB Atlas
      ↓
Operación exitosa
      ↓
Evento servicesUpdated
      ↓
Socket.io
      ↓
Actualización de la vista en el navegador
```

La comunicación en tiempo real complementa los endpoints REST existentes, sin reemplazarlos ni modificar su función principal.

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

**Importante:** no publiques credenciales reales ni la URI privada de conexión a MongoDB Atlas.

## Instalación y ejecución

### Requisitos previos

- Node.js.
- npm.
- Una instancia de MongoDB Atlas configurada y accesible.

### 1. Clonar el repositorio

```bash
git clone https://github.com/mariano925/backend-turnos-reservas.git
```

### 2. Acceder al directorio

```bash
cd backend-turnos-reservas
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando `.env.example` como referencia.

Completar `MONGODB_URI` con la URI de conexión correspondiente a la instancia de MongoDB Atlas y configurar las demás variables según el entorno.

### 5. Iniciar el servidor

```bash
npm start
```

Si la conexión con MongoDB Atlas se establece correctamente, el servidor quedará escuchando en el puerto configurado.

Por defecto, la aplicación está disponible en:

`http://localhost:8080`

## Acceso a la aplicación

Con el servidor en ejecución, se puede acceder a los siguientes recursos:

| Recurso | URL local |
|---|---|
| API de servicios | `http://localhost:8080/api/services` |
| API de reservas | `http://localhost:8080/api/bookings` |
| Vista de servicios | `http://localhost:8080/views/services` |
| Vista de reservas | `http://localhost:8080/views/availability` |

Los endpoints de reservas que requieren identificadores deben completarse con los parámetros correspondientes.

## Tecnologías

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para desarrollar la aplicación y la API REST.
- **ECMAScript Modules (ESM):** sistema de módulos de JavaScript.
- **dotenv:** configuración mediante variables de entorno.
- **Mongoose:** modelado de datos y acceso a MongoDB.
- **MongoDB Atlas:** base de datos en la nube.
- **Express Handlebars:** motor de plantillas para renderizar vistas.
- **Socket.io:** comunicación en tiempo real entre el servidor y los clientes.
- **HTML, CSS y JavaScript:** estructura, presentación e interactividad de las vistas.

## Repositorio

[GitHub: backend-turnos-reservas](https://github.com/mariano925/backend-turnos-reservas)
