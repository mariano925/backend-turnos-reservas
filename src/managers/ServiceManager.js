// Importamos los servicios
import services from "../data/services.json" with { type: "json" };

// Administramos los servicios
class ServiceManager {
    constructor() {
        this.services = services;
    }

    // Obtenemos todos
    getServices() {
        return this.services;
    }

    // Buscamos por ID
    getServiceById(id) {
        return this.services.find(service => service.id === id);
    }

    // Agregamos un servicio
    addService(serviceData) {
        const requiredFields = [
            "name",
            "description",
            "duration",
            "price",
            "category",
            "available"
        ];

        for (const field of requiredFields) {
            if (serviceData[field] === undefined) {
                throw new Error(`Falta el campo: ${field}`);
            }
        }

        const newId = this.services.length > 0
            ? Math.max(...this.services.map(service => service.id)) + 1
            : 1;

        const newService = {
            id: newId,
            ...serviceData
        };

        this.services.push(newService);

        return newService;
    }

    // Actualizamos un servicio
    updateService(id, updatedData) {
        const serviceIndex = this.services.findIndex(
            service => service.id === id
        );

        if (serviceIndex === -1) {
            throw new Error("Servicio no encontrado");
        }

        const { id: ignoredId, ...dataToUpdate } = updatedData;

        this.services[serviceIndex] = {
            ...this.services[serviceIndex],
            ...dataToUpdate,
            id
        };

        return this.services[serviceIndex];
    }

    // Eliminamos un servicio
    deleteService(id) {
        const serviceIndex = this.services.findIndex(
            service => service.id === id
        );

        if (serviceIndex === -1) {
            throw new Error("Servicio no encontrado");
        }

        const deletedService = this.services.splice(serviceIndex, 1);

        return deletedService[0];
    }
}

// Exportamos la clase
export default ServiceManager;