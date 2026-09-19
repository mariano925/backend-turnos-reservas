import ServiceManager from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();

// Obtiene todos los servicios
export const getServices = async (req, res) => {
    const { category, available } = req.query;

    const services = await serviceManager.getServices();

    const filteredServices = category
        ? services.filter(service => service.category === category)
        : services;

    let result = filteredServices;

    if (available !== undefined) {
        result = result.filter(
            service => service.available === (available === "true")
        );
    }

    res.status(200).json(result);
};

// Busca un servicio por ID
export const getServiceById = async (req, res) => {
    const id = Number(req.params.sid);

    const service = await serviceManager.getServiceById(id);

    if (!service) {
        return res.status(404).json({
            error: "Servicio no encontrado"
        });
    }

    res.status(200).json(service);
};

// Crea un servicio
export const createService = async (req, res) => {
    try {
        const newService = await serviceManager.addService(req.body);

        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// Actualiza un servicio
export const updateService = async (req, res) => {
    try {
        const id = Number(req.params.sid);

        const updatedService = await serviceManager.updateService(
            id,
            req.body
        );

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};

// Elimina un servicio
export const deleteService = async (req, res) => {
    try {
        const id = Number(req.params.sid);

        const deletedService = await serviceManager.deleteService(id);

        res.status(200).json(deletedService);
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};