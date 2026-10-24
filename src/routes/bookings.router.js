
import express from "express";

import {
    createBooking,
    getBookingById,
    addServiceToBooking
} from "../controllers/bookings.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import {
    createBookingSchema,
    bookingServiceParamsSchema
} from "../validations/booking.schema.js";

const router = express.Router();

// Valida antes de crear la reserva.
router.post("/", validate(createBookingSchema), createBooking);

// Consulta una reserva por su ID.
router.get("/:bid", getBookingById);

// Valida ambos IDs antes de agregar el servicio.
router.post(
    "/:bid/services/:sid",
    validate(bookingServiceParamsSchema, "params"),
    addServiceToBooking
);

export default router;
