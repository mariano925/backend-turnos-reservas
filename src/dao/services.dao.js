
import Service from "../models/service.model.js";

// DAO de servicios
class ServicesDAO {

    // Obtiene todos los servicios o una consulta paginada.
    async getAll(options) {
        // Sin opciones, devuelve el listado completo para Socket.IO.
        if (options === undefined) {
            return await Service.find().lean();
        }

        const {
            filters = {},
            page = 1,
            limit = 10,
            sortBy = "name",
            order = "asc"
        } = options;

        const skip = (page - 1) * limit;
        const sortOrder = order === "desc" ? -1 : 1;

        // Ejecuta la consulta y el conteo en paralelo.
        const [services, total] = await Promise.all([
            Service.find(filters)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),

            Service.countDocuments(filters)
        ]);

        return {
            services,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasPrevPage: page > 1,
            hasNextPage: page * limit < total
        };
    }

    // Busca un servicio por ID.
    async getById(id) {
        return await Service.findById(id).lean();
    }

    // Crea un servicio.
    async create(serviceData) {
        return await Service.create(serviceData);
    }

    // Actualiza un servicio y ejecuta las validaciones del esquema.
    async update(id, updatedData) {
        return await Service.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        ).lean();
    }

    // Elimina un servicio.
    async delete(id) {
        return await Service.findByIdAndDelete(id).lean();
    }
}

// Exportamos el DAO.
export default ServicesDAO;
