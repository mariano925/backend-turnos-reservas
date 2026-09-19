import express from "express";
import {
    createBooking,
    getBookingById,
    addServiceToBooking
} from "../controllers/bookings.controller.js";

const router = express.Router();

// Conecta rutas con controllers
router.post("/", createBooking);
router.get("/:bid", getBookingById);
router.post("/:bid/services/:sid", addServiceToBooking);

export default router;