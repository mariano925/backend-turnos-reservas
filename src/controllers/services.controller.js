// Service de servicios
import ServicesService from "../services/services.service.js";
import ServicesRepository from "../repositories/services.repository.js";

// Instancias
const servicesRepository = new ServicesRepository();
const servicesService = new ServicesService(servicesRepository);

// Obtiene todos los servicios
export const getServices = async (req, res) => {
    try {
        const services = await servicesService.getServices(req.query);

        res.status(200).json(services);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Busca un servicio por ID
export const getServiceById = async (req, res) => {
    try {
        const id = req.params.sid;

        const service = await servicesService.getServiceById(id);

        if (!service) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        res.status(200).json(service);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de servicio inválido"
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// Crea un servicio
export const createService = async (req, res) => {
    try {
        const newService = await servicesService.createService(req.body);

        res.status(201).json(newService);

    } catch (error) {
        if (error.message.startsWith("Falta el campo:")) {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// Actualiza un servicio
export const updateService = async (req, res) => {
    try {
        const id = req.params.sid;

        const updatedService = await servicesService.updateService(
            id,
            req.body
        );

        res.status(200).json(updatedService);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de servicio inválido"
            });
        }

        if (error.message === "Servicio no encontrado") {
            return res.status(404).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// Elimina un servicio
export const deleteService = async (req, res) => {
    try {
        const id = req.params.sid;

        const deletedService = await servicesService.deleteService(id);

        res.status(200).json(deletedService);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de servicio inválido"
            });
        }

        if (error.message === "Servicio no encontrado") {
            return res.status(404).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

