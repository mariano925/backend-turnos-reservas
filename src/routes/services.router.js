
import express from "express";

import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from "../controllers/services.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import {
    createServiceSchema,
    updateServiceSchema
} from "../validations/service.schema.js";

const router = express.Router();

// Lista y consulta servicios.
router.get("/", getServices);
router.get("/:sid", getServiceById);

// Valida antes de crear o actualizar.
router.post("/", validate(createServiceSchema), createService);
router.put("/:sid", validate(updateServiceSchema), updateService);

// Elimina un servicio.
router.delete("/:sid", deleteService);

export default router;
