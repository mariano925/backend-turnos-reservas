# Backend de Turnos y Reservas

## Primera Pre-entrega - Administrador de Servicios

Este proyecto es la primera etapa de mi backend para un sistema de turnos y reservas.

El objetivo de esta entrega es crear una base funcional para administrar los diferentes servicios que ofrece el sistema.

## Que hice en esta primera etapa

En esta etapa trabaje con Node.js utilizando modulos ESM y cree una clase llamada `ServiceManager` para administrar los servicios.

Los datos se guardan y se administran mediante un archivo JSON.

El sistema permite:

* Obtener todos los servicios.
* Buscar un servicio por su ID.
* Agregar nuevos servicios.
* Actualizar servicios existentes.
* Eliminar servicios.
* Validar que los datos necesarios esten completos.
* Generar automaticamente el ID de los nuevos servicios.
* Mantener el ID original cuando se actualiza un servicio.

## Tecnologias utilizadas

* Node.js
* JavaScript
* ESM
* dotenv
* JSON
* Git
* GitHub

## Estructura del proyecto

```text
Backend1-Mariano/
|
|-- src/
|   |-- config/
|   |   `-- env.config.js
|   |
|   |-- data/
|   |   `-- services.json
|   |
|   `-- managers/
|       `-- ServiceManager.js
|
|-- app.js
|-- package.json
|-- package-lock.json
|-- .env.example
|-- .gitignore
`-- README.md
```

## Variables de entorno

El proyecto utiliza las siguientes variables de entorno:

* `PORT`
* `NODE_ENV`

Para trabajar de manera local se debe crear un archivo `.env` en la raiz del proyecto.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no se sube al repositorio porque esta incluido en `.gitignore`.

## Instalacion

Para instalar las dependencias del proyecto se debe ejecutar:

```bash
npm install
```

## Ejecucion

Para ejecutar el proyecto se utiliza:

```bash
node app.js
```

Al iniciar, el sistema valida que las variables de entorno requeridas existan.

## Recurso services

Cada servicio tiene la siguiente estructura:

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

Los servicios se almacenan en el archivo `src/data/services.json`.

## Ejemplos de uso

### Obtener todos los servicios

```js
await serviceManager.getServices();
```

### Buscar un servicio por ID

```js
await serviceManager.getServiceById(2);
```

Si el servicio no existe, el metodo devuelve `null`.

### Agregar un servicio

```js
await serviceManager.addService({
    name: "Lavado de cabello",
    description: "Lavado y acondicionamiento del cabello",
    duration: 15,
    price: 2000,
    category: "Peluqueria",
    available: true
});
```

El ID se genera automaticamente y no se recibe desde afuera.

### Actualizar un servicio

```js
await serviceManager.updateService(2, {
    price: 3500,
    duration: 25
});
```

El ID original del servicio se mantiene y no puede ser modificado.

### Eliminar un servicio

```js
await serviceManager.deleteService(3);
```

Si el servicio no existe, el sistema genera un error indicando que el servicio no fue encontrado.

## Estado del proyecto

Esta es la primera etapa de mi proyecto Backend de Turnos y Reservas.

En las siguientes etapas voy a incorporar nuevas funcionalidades para convertir esta base en una API completa para la gestion de servicios y reservas.
