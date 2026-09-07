// Importamos Express
import express from "express";

// Importamos el manager
import BookingManager from "../managers/BookingManager.js";

const router = express.Router();
const bookingManager = new BookingManager();

// Crear una reserva
router.post("/", async (req, res) => {
    try {
        const bookingData = req.body;

        const newBooking = await bookingManager.createBooking(bookingData);

        res.status(201).json(newBooking);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener reserva por ID
router.get("/:bid", async (req, res) => {
    const id = Number(req.params.bid);

    const booking = await bookingManager.getBookingById(id);

    if (!booking) {
        return res.status(404).json({
            error: "Reserva no encontrada"
        });
    }

    res.status(200).json(booking);
});

// Agregar servicio a una reserva
router.post("/:bid/services/:sid", async (req, res) => {
    try {
        const bookingId = Number(req.params.bid);
        const serviceId = Number(req.params.sid);

        const updatedBooking =
            await bookingManager.addServiceToBooking(
                bookingId,
                serviceId
            );

        res.status(200).json(updatedBooking);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Exportamos el router
export default router;

