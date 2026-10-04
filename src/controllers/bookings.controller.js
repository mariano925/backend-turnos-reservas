// Service de reservas
import BookingsService from "../services/bookings.service.js";
import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

// Instancias
const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

const bookingsService = new BookingsService(
    bookingsRepository,
    servicesRepository
);

// Crea una reserva
export const createBooking = async (req, res) => {
    try {
        const newBooking = await bookingsService.createBooking(req.body);

        res.status(201).json(newBooking);

    } catch (error) {
        if (error.message.startsWith("Falta el campo:")) {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// Busca una reserva por ID
export const getBookingById = async (req, res) => {
    try {
        const id = req.params.bid;

        const booking = await bookingsService.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de reserva inválido"
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// Agrega un servicio a una reserva
export const addServiceToBooking = async (req, res) => {
    try {
        const bookingId = req.params.bid;
        const serviceId = req.params.sid;

        const updatedBooking =
            await bookingsService.addServiceToBooking(
                bookingId,
                serviceId
            );

        res.status(200).json(updatedBooking);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "ID de reserva o servicio inválido"
            });
        }

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

