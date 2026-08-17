# Backend de Turnos y Reservas

## Primera Pre-entrega - Administrador de Servicios

Este proyecto es la primera etapa de mi backend para un sistema de turnos y reservas.

El objetivo de esta entrega es crear una base funcional para administrar los diferentes servicios que ofrece el sistema.

## Que hice en esta primera etapa

En esta etapa trabaje con Node.js utilizando modulos ESM y cree una clase llamada `ServiceManager` para administrar los servicios.

Los datos se guardan y se administran mediante un archivo JSON.

El sistema permite:

- Obtener todos los servicios.
- Buscar un servicio por su ID.
- Agregar nuevos servicios.
- Actualizar servicios existentes.
- Eliminar servicios.
- Validar que los datos necesarios esten completos.
- Generar automaticamente el ID de los nuevos servicios.
- Mantener el ID original cuando se actualiza un servicio.

## Tecnologias utilizadas

- Node.js
- JavaScript
- ESM
- dotenv
- JSON
- Git
- GitHub

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