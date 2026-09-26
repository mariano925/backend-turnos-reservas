// Herramientas para archivos
import { readFile, writeFile } from "fs/promises";

// Ruta del JSON
const filePath = new URL("../data/services.json", import.meta.url);

// DAO de servicios
class ServicesDAO {

    // Lee todos los servicios
    async getAll() {
        const data = await readFile(filePath, "utf-8");

        return JSON.parse(data);
    }

    // Busca un servicio por ID
    async getById(id) {
        const services = await this.getAll();

        return services.find(service => service.id === id) || null;
    }

    // Crea y guarda un servicio
    async create(serviceData) {
        const services = await this.getAll();

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

    // Actualiza y guarda un servicio
    async update(id, updatedData) {
        const services = await this.getAll();

        const serviceIndex = services.findIndex(
            service => service.id === id
        );

        if (serviceIndex === -1) {
            return null;
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

    // Elimina y guarda los cambios
    async delete(id) {
        const services = await this.getAll();

        const serviceIndex = services.findIndex(
            service => service.id === id
        );

        if (serviceIndex === -1) {
            return null;
        }

        const deletedService = services.splice(serviceIndex, 1);

        await writeFile(
            filePath,
            JSON.stringify(services, null, 2)
        );

        return deletedService[0];
    }
}

// Exportamos el DAO
export default ServicesDAO;