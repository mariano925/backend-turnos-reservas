import express from "express";

import {
    createBooking,
    getBookingById,
    addServiceToBooking,
    removeServiceFromBooking,
    setBookingServiceQuantity,
    clearBookingServices,
    deleteBooking
} from "../controllers/bookings.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
    createBookingSchema,
    bookingServiceParamsSchema,
    bookingIdParamsSchema,
    setBookingServiceQuantitySchema
} from "../validations/booking.schema.js";

const router = express.Router();

// Crea una reserva con datos validados.
router.post(
    "/",
    validate(createBookingSchema),
    createBooking
);

// Consulta una reserva por su ID.
router.get(
    "/:bid",
    validate(bookingIdParamsSchema, "params"),
    getBookingById
);

// Elimina una reserva completa.
router.delete(
    "/:bid",
    validate(bookingIdParamsSchema, "params"),
    deleteBooking
);

// Elimina todos los servicios asociados a una reserva.
router.delete(
    "/:bid/services",
    validate(bookingIdParamsSchema, "params"),
    clearBookingServices
);

// Elimina un servicio específico de una reserva.
router.delete(
    "/:bid/services/:sid",
    validate(bookingServiceParamsSchema, "params"),
    removeServiceFromBooking
);

// Establece una cantidad específica para un servicio asociado.
router.patch(
    "/:bid/services/:sid",
    validate(bookingServiceParamsSchema, "params"),
    validate(setBookingServiceQuantitySchema),
    setBookingServiceQuantity
);

// Agrega un servicio o incrementa su cantidad.
router.post(
    "/:bid/services/:sid",
    validate(bookingServiceParamsSchema, "params"),
    addServiceToBooking
);

export default router;