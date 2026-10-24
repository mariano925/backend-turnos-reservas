
import ServicesService from "../services/services.service.js";
import ServicesRepository from "../repositories/services.repository.js";

const servicesRepository = new ServicesRepository();
const servicesService = new ServicesService(servicesRepository);

const isValidationError = (error) =>
    error.name === "ValidationError" ||
    error.name === "CastError";

// Emite el listado completo sin alterar la respuesta de la API si falla.
const emitServicesUpdated = async (req) => {
    try {
        const io = req.app.get("io");

        if (!io) return;

        const services = await servicesService.getServices();
        io.emit("servicesUpdated", services);
    } catch (error) {
        console.error(
            "Error al emitir servicios actualizados:",
            error.message
        );
    }
};

// Obtiene servicios con filtros, ordenamiento y paginación.
export const getServices = async (req, res) => {
    try {
        const services = await servicesService.getServices(req.query);

        return res.status(200).json(services);
    } catch (error) {
        if (error.name === "QueryValidationError") {
            return res.status(400).json({ error: error.message });
        }

        console.error("Error al obtener servicios:", error.message);

        return res.status(500).json({
            error: "Error interno al obtener los servicios"
        });
    }
};

// Obtiene un servicio por su ID.
export const getServiceById = async (req, res) => {
    try {
        const service = await servicesService.getServiceById(req.params.sid);

        if (!service) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        return res.status(200).json(service);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de servicio inválido"
            });
        }

        return res.status(500).json({ error: error.message });
    }
};

// Crea un servicio y notifica a los clientes conectados.
export const createService = async (req, res) => {
    try {
        const newService = await servicesService.createService(req.body);

        await emitServicesUpdated(req);

        return res.status(201).json(newService);
    } catch (error) {
        if (
            error.message.startsWith("Falta el campo:") ||
            isValidationError(error)
        ) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: error.message });
    }
};

// Actualiza un servicio y notifica a los clientes conectados.
export const updateService = async (req, res) => {
    try {
        const updatedService = await servicesService.updateService(
            req.params.sid,
            req.body
        );

        await emitServicesUpdated(req);

        return res.status(200).json(updatedService);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de servicio o datos inválidos"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }

        if (error.message === "Servicio no encontrado") {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ error: error.message });
    }
};

// Elimina un servicio y notifica a los clientes conectados.
export const deleteService = async (req, res) => {
    try {
        const deletedService = await servicesService.deleteService(
            req.params.sid
        );

        await emitServicesUpdated(req);

        return res.status(200).json(deletedService);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de servicio inválido"
            });
        }

        if (error.message === "Servicio no encontrado") {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ error: error.message });
    }
};
