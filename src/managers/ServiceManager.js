// Importamos herramientas para archivos
import { readFile, writeFile } from "fs/promises";

// Ruta del archivo JSON
const filePath = new URL("../data/services.json", import.meta.url);

// Administramos los servicios
class ServiceManager {

    // Leemos los servicios
    async getServices() {
        const data = await readFile(filePath, "utf-8");
        return JSON.parse(data);
    }

    // Buscamos por ID
    async getServiceById(id) {
        const services = await this.getServices();

        return services.find(service => service.id === id) || null;
    }

    // Agregamos un servicio
    async addService(serviceData) {
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

        const services = await this.getServices();

        const newId = services.length > 0
            ? Math.max(...services.map(service => service.id)) + 1
            : 1;

        const newService = {
            id: newId,
            ...serviceData
        };

        services.push(newService);

        await writeFile(
            filePath,
            JSON.stringify(services, null, 2)
        );

        return newService;
    }

    // Actualizamos un servicio
    async updateService(id, updatedData) {
        const services = await this.getServices();

        const serviceIndex = services.findIndex(
            service => service.id === id
        );

        if (serviceIndex === -1) {
            throw new Error("Servicio no encontrado");
        }

        const { id: ignoredId, ...dataToUpdate } = updatedData;

        services[serviceIndex] = {
            ...services[serviceIndex],
            ...dataToUpdate,
            id
        };

        await writeFile(
            filePath,
            JSON.stringify(services, null, 2)
        );

        return services[serviceIndex];
    }

    // Eliminamos un servicio
    async deleteService(id) {
        const services = await this.getServices();

        const serviceIndex = services.findIndex(
            service => service.id === id
        );

        if (serviceIndex === -1) {
            throw new Error("Servicio no encontrado");
        }

        const deletedService = services.splice(serviceIndex, 1);

        await writeFile(
            filePath,
            JSON.stringify(services, null, 2)
        );

        return deletedService[0];
    }
}

// Exportamos la clase
export default ServiceManager;