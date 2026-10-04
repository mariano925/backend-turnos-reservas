// Modelo de servicios
import Service from "../models/service.model.js";

// DAO de servicios
class ServicesDAO {

    // Obtiene todos los servicios
    async getAll() {
        return await Service.find().lean();
    }

    // Busca un servicio por ID
    async getById(id) {
        return await Service.findById(id).lean();
    }

    // Crea un servicio
    async create(serviceData) {
        return await Service.create(serviceData);
    }

    // Actualiza un servicio
    async update(id, updatedData) {
        return await Service.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        ).lean();
    }

    // Elimina un servicio
    async delete(id) {
        return await Service.findByIdAndDelete(id).lean();
    }
}

// Exportamos el DAO
export default ServicesDAO;