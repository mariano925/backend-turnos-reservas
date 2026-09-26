// DAO de servicios
import ServicesDAO from "../dao/services.dao.js";

// Repository de servicios
class ServicesRepository {

    constructor() {
        this.dao = new ServicesDAO();
    }

    // Obtiene todos los servicios
    async getAll() {
        return await this.dao.getAll();
    }

    // Busca un servicio por ID
    async getById(id) {
        return await this.dao.getById(id);
    }

    // Crea un servicio
    async create(serviceData) {
        return await this.dao.create(serviceData);
    }

    // Actualiza un servicio
    async update(id, updatedData) {
        return await this.dao.update(id, updatedData);
    }

    // Elimina un servicio
    async delete(id) {
        return await this.dao.delete(id);
    }
}

// Exportamos el Repository
export default ServicesRepository;