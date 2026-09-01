import express from "express"; // Importa Express
import ServiceManager from "../managers/ServiceManager.js"; // Importa el manager

const router = express.Router(); // Crea el router
const serviceManager = new ServiceManager(); // Crea el manager

router.get("/", async (req, res) => { // Ruta GET
    const { category, available } = req.query; // Lee los filtros

    const services = await serviceManager.getServices(); // Obtiene servicios

    const filteredServices = category
        ? services.filter(service => service.category === category)
        : services;

    let result = filteredServices; // Resultado inicial

    if (available !== undefined) { // Si hay filtro
        result = result.filter(
            service => service.available === (available === "true")
        );
    }

    res.status(200).json(result); // Envía el resultado
});

router.get("/:sid", async (req, res) => { // Ruta por ID
    const id = Number(req.params.sid); // Convierte el ID
    const service = await serviceManager.getServiceById(id); // Busca el servicio

    if (!service) { // Si no existe
        return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.status(200).json(service); // Envía el servicio
});

router.post("/", async (req, res) => { // Ruta POST
    try {
        const serviceData = req.body; // Lee los datos
        const newService = await serviceManager.addService(serviceData); // Crea el servicio

        res.status(201).json(newService); // Envía el nuevo servicio
    } catch (error) {
        res.status(400).json({ error: error.message }); // Envía el error
    }
});

router.put("/:sid", async (req, res) => { // Ruta PUT
    try {
        const id = Number(req.params.sid); // Obtiene el ID
        const updatedData = req.body; // Lee los cambios

        const updatedService = await serviceManager.updateService(id, updatedData); // Actualiza

        res.status(200).json(updatedService); // Envía el actualizado
    } catch (error) {
        res.status(404).json({ error: error.message }); // Envía el error
    }
});

router.delete("/:sid", async (req, res) => { // Ruta DELETE
    try {
        const id = Number(req.params.sid); // Obtiene el ID
        const deletedService = await serviceManager.deleteService(id); // Elimina el servicio

        res.status(200).json(deletedService); // Envía el eliminado

    } catch (error) {
        res.status(404).json({ error: error.message }); // Envía el error
    }
});

export default router; // Exporta el router