// Lógica de servicios
class ServicesService {

    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }

    // Obtiene y filtra los servicios
    async getServices({ category, available } = {}) {
        let services = await this.servicesRepository.getAll();

        if (category) {
            services = services.filter(
                service => service.category === category
            );
        }

        if (available !== undefined) {
            services = services.filter(
                service => service.available === (available === "true")
            );
        }

        return services;
    }

    // Busca un servicio por ID
    async getServiceById(id) {
        return await this.servicesRepository.getById(id);
    }

    // Valida y crea un servicio
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

    // Actualiza un servicio
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

    // Elimina un servicio
    async deleteService(id) {
        const deletedService = await this.servicesRepository.delete(id);

        if (!deletedService) {
            throw new Error("Servicio no encontrado");
        }

        return deletedService;
    }
}

// Exportamos el Service
export default ServicesService;