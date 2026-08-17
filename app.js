// Importamos el manager
import ServiceManager from "./src/managers/ServiceManager.js";

const serviceManager = new ServiceManager();

// Obtenemos todos
console.log(serviceManager.getServices());

// Buscamos por ID
console.log(serviceManager.getServiceById(2));

// Agregamos un servicio
const newService = serviceManager.addService({
    name: "Lavado de cabello",
    description: "Lavado y acondicionamiento del cabello",
    duration: 15,
    price: 2000,
    category: "Peluquería",
    available: true
});

console.log(newService);

// Actualizamos un servicio
const updatedService = serviceManager.updateService(2, {
    price: 3500,
    duration: 25
});

console.log(updatedService);

// Eliminamos un servicio
const deletedService = serviceManager.deleteService(3);

console.log(deletedService);