# Backend de Turnos y Reservas

## Módulo 1 - Diseño de endpoints REST para servicios

Este proyecto corresponde al **Módulo 1** del backend de un sistema de turnos y reservas.

El objetivo de esta etapa es construir una primera **API REST con Express** para gestionar el recurso `services`.

En esta etapa se trabaja con rutas, parámetros dinámicos, query params y body, conectando los endpoints con una clase `ServiceManager` encargada de administrar los datos.

Los servicios se almacenan actualmente en un archivo JSON.

## Qué hice en este módulo

En esta etapa trabajé con:

* Node.js
* Express
* Módulos ESM
* Variables de entorno con `dotenv`
* Rutas REST
* Parámetros de ruta mediante `req.params`
* Query params mediante `req.query`
* Datos del body mediante `req.body`
* Persistencia mediante archivo JSON
* Códigos de estado HTTP

La lógica de administración de servicios permanece dentro de `ServiceManager`, mientras que las rutas se encuentran en `services.router.js`.

## Endpoints implementados

| Método | Ruta                              | Comportamiento              |
| ------ | --------------------------------- | --------------------------- |
| GET    | `/api/services`                   | Obtiene todos los servicios |
| GET    | `/api/services?category=Barbería` | Filtra por categoría        |
| GET    | `/api/services?available=true`    | Filtra por disponibilidad   |
| GET    | `/api/services/:sid`              | Obtiene un servicio por ID  |
| POST   | `/api/services`                   | Crea un nuevo servicio      |
| PUT    | `/api/services/:sid`              | Actualiza un servicio       |
| DELETE | `/api/services/:sid`              | Elimina un servicio         |

## Códigos de estado HTTP

La API utiliza los siguientes códigos:

* `200` → operación realizada correctamente.
* `201` → servicio creado correctamente.
* `400` → datos incorrectos o campos obligatorios faltantes.
* `404` → servicio no encontrado.

## Estructura del proyecto

```text
Backend1-Mariano/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── data/
│   │   └── services.json
│   │
│   ├── managers/
│   │   └── ServiceManager.js
│   │
│   └── routes/
│       └── services.router.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## Responsabilidad de los archivos principales

### `app.js`

Configura Express y conecta el router de servicios.

```js
app.use(express.json());

app.use("/api/services", servicesRouter);
```

### `server.js`

Se encarga de iniciar el servidor y utilizar el puerto configurado mediante variables de entorno.

El servidor se ejecuta con:

```bash
node server.js
```

### `src/routes/services.router.js`

Contiene los endpoints REST del recurso `services`.

Utiliza:

* `req.params` para obtener el ID.
* `req.query` para obtener filtros.
* `req.body` para recibir datos en POST y PUT.

### `src/managers/ServiceManager.js`

Contiene la lógica necesaria para:

* Obtener servicios.
* Buscar servicios por ID.
* Crear servicios.
* Actualizar servicios.
* Eliminar servicios.
* Validar campos obligatorios.
* Generar automáticamente los IDs.

### `src/data/services.json`

Contiene los datos de los servicios.

## Recurso `services`

Cada servicio posee la siguiente estructura:

```js
{
    id,
    name,
    description,
    duration,
    price,
    category,
    available
}
```

El `id` es generado automáticamente al crear un nuevo servicio.

## Variables de entorno

El proyecto utiliza:

```env
PORT=8080
NODE_ENV=development
```

Para trabajar localmente se debe crear un archivo `.env` en la raíz del proyecto.

El archivo `.env` no debe subirse a GitHub y se encuentra incluido en `.gitignore`.

## Instalación

Para instalar las dependencias:

```bash
npm install
```

## Ejecución

Para iniciar el servidor:

```bash
node server.js
```

Si todo está correctamente configurado, se mostrará un mensaje similar a:

```text
Variables de entorno cargadas correctamente.
Servidor escuchando en el puerto 8080
```

## Ejemplos de uso

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

### Crear un servicio

```http
POST http://localhost:8080/api/services
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

El `id` se genera automáticamente.

### Actualizar un servicio

```http
PUT http://localhost:8080/api/services/2
```

Body:

```json
{
    "price": 3500,
    "duration": 25
}
```

El `id` original no puede ser modificado.

### Eliminar un servicio

```http
DELETE http://localhost:8080/api/services/3
```

Si el servicio existe, se elimina y se devuelve el servicio eliminado.

Si no existe, la API responde con:

```json
{
    "error": "Servicio no encontrado"
}
```

## Estado del proyecto

Este proyecto corresponde al **Módulo 1 - Diseño de endpoints REST para servicios**.

La API permite realizar las operaciones básicas de un recurso REST:

**GET → POST → PUT → DELETE**

La lógica se encuentra separada entre las rutas, la configuración de Express y el `ServiceManager`.

En las siguientes etapas se incorporarán nuevas funcionalidades al sistema de turnos y reservas.
