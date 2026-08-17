// Cargamos y validamos las variables de entorno
import "./src/config/env.config.js";

// Importamos el manager
import ServiceManager from "./src/managers/ServiceManager.js";

const serviceManager = new ServiceManager();

async function main() {

    // Obtenemos todos los servicios
    console.log(await serviceManager.getServices());

    // Buscamos un servicio por ID
    console.log(await serviceManager.getServiceById(2));

    // Buscamos un ID inexistente
    console.log(await serviceManager.getServiceById(99));
}

main();