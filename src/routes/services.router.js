import express from "express";

import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from "../controllers/services.controller.js";

const router = express.Router();

// Lista los servicios
router.get("/", getServices);

// Busca un servicio
router.get("/:sid", getServiceById);

// Crea un servicio
router.post("/", createService);

// Actualiza un servicio
router.put("/:sid", updateService);

// Elimina un servicio
router.delete("/:sid", deleteService);

export default router;