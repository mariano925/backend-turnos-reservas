// Service de reservas
import BookingsService from "../services/bookings.service.js";

// Instancia del Service
const bookingsService = new BookingsService();

// Crea una reserva
export const createBooking = async (req, res) => {
    try {
        const newBooking = await bookingsService.createBooking(req.body);

        res.status(201).json(newBooking);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// Busca una reserva por ID
export const getBookingById = async (req, res) => {
    try {
        const id = Number(req.params.bid);

        const booking = await bookingsService.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Agrega un servicio a una reserva
export const addServiceToBooking = async (req, res) => {
    try {
        const bookingId = Number(req.params.bid);
        const serviceId = Number(req.params.sid);

        const updatedBooking =
            await bookingsService.addServiceToBooking(
                bookingId,
                serviceId
            );

        res.status(200).json(updatedBooking);

    } catch (error) {
        if (
            error.message === "Reserva no encontrada" ||
            error.message === "Servicio no encontrado"
        ) {
            return res.status(404).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};