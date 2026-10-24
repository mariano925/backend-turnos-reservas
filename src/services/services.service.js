
class QueryValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "QueryValidationError";
    }
}

// Lógica de servicios
class ServicesService {

    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }

    // Obtiene servicios filtrados, ordenados y paginados.
    async getServices(query) {
        // Sin argumentos, devuelve el listado completo para Socket.IO.
        if (query === undefined) {
            return await this.servicesRepository.getAll();
        }

        const {
            category,
            available,
            page = "1",
            limit = "10",
            sortBy = "name",
            order = "asc"
        } = query;

        const filters = {};

        // Valida y aplica el filtro por categoría.
        if (category !== undefined) {
            if (typeof category !== "string" || !category.trim()) {
                throw new QueryValidationError(
                    "La categoría no puede estar vacía"
                );
            }

            filters.category = category.trim();
        }

        // Convierte la disponibilidad de texto a booleano.
        if (available !== undefined) {
            if (!["true", "false"].includes(available)) {
                throw new QueryValidationError(
                    "El parámetro available debe ser 'true' o 'false'"
                );
            }

            filters.available = available === "true";
        }

        // Valida la página y el límite de resultados.
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (!Number.isInteger(pageNumber) || pageNumber < 1) {
            throw new QueryValidationError(
                "La página debe ser un entero mayor que 0"
            );
        }

        if (
            !Number.isInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100
        ) {
            throw new QueryValidationError(
                "El límite debe ser un entero entre 1 y 100"
            );
        }

        // Solo permite ordenar por campos autorizados.
        const allowedSortFields = [
            "name",
            "price",
            "duration",
            "category"
        ];

        if (!allowedSortFields.includes(sortBy)) {
            throw new QueryValidationError(
                "El campo de ordenamiento no es válido"
            );
        }

        // Valida la dirección del ordenamiento.
        if (!["asc", "desc"].includes(order)) {
            throw new QueryValidationError(
                "El orden debe ser 'asc' o 'desc'"
            );
        }

        // Envía los parámetros al Repository.
        return await this.servicesRepository.getAll({
            filters,
            page: pageNumber,
            limit: limitNumber,
            sortBy,
            order
        });
    }

    // Busca un servicio por ID.
    async getServiceById(id) {
        return await this.servicesRepository.getById(id);
    }

    // Valida y crea un servicio.
    async createService(serviceData) {
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

        return await this.servicesRepository.create(serviceData);
    }

    // Actualiza un servicio.
    async updateService(id, updatedData) {
        const updatedService = await this.servicesRepository.update(
            id,
            updatedData
        );

        if (!updatedService) {
            throw new Error("Servicio no encontrado");
        }

        return updatedService;
    }

    // Elimina un servicio.
    async deleteService(id) {
        const deletedService = await this.servicesRepository.delete(id);

        if (!deletedService) {
            throw new Error("Servicio no encontrado");
        }

        return deletedService;
    }
}

export default ServicesService;
