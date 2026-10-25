import BookingsService from "../services/bookings.service.js";
import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

// Instancias de las capas.
const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

const bookingsService = new BookingsService(
    bookingsRepository,
    servicesRepository
);

// Responde según el tipo de error producido.
const handleBookingError = (res, error) => {
    if (
        error.name === "CastError" ||
        error.name === "ValidationError"
    ) {
        return res.status(400).json({
            error: error.message
        });
    }

    const notFoundMessages = [
        "Reserva no encontrada",
        "Servicio no encontrado",
        "Servicio no asociado a la reserva"
    ];

    if (notFoundMessages.includes(error.message)) {
        return res.status(404).json({
            error: error.message
        });
    }

    return res.status(500).json({
        error: error.message
    });
};

// Crea una reserva.
export const createBooking = async (req, res) => {
    try {
        const newBooking = await bookingsService.createBooking(req.body);

        return res.status(201).json(newBooking);
    } catch (error) {
        if (error.message.startsWith("Falta el campo:")) {
            return res.status(400).json({
                error: error.message
            });
        }

        return handleBookingError(res, error);
    }
};

// Consulta una reserva por ID.
export const getBookingById = async (req, res) => {
    try {
        const booking = await bookingsService.getBookingById(
            req.params.bid
        );

        if (!booking) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        return res.status(200).json(booking);
    } catch (error) {
        return handleBookingError(res, error);
    }
};

// Agrega un servicio o incrementa su cantidad.
export const addServiceToBooking = async (req, res) => {
    try {
        const updatedBooking =
            await bookingsService.addServiceToBooking(
                req.params.bid,
                req.params.sid
            );

        return res.status(200).json(updatedBooking);
    } catch (error) {
        if (
            error.message ===
            "La cantidad máxima por servicio es 10"
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

        return handleBookingError(res, error);
    }
};

// Quita un servicio de una reserva.
export const removeServiceFromBooking = async (req, res) => {
    try {
        const updatedBooking =
            await bookingsService.removeServiceFromBooking(
                req.params.bid,
                req.params.sid
            );

        return res.status(200).json(updatedBooking);
    } catch (error) {
        return handleBookingError(res, error);
    }
};

// Establece una cantidad concreta para un servicio asociado.
export const setBookingServiceQuantity = async (req, res) => {
    try {
        const updatedBooking =
            await bookingsService.setBookingServiceQuantity(
                req.params.bid,
                req.params.sid,
                req.body.quantity
            );

        return res.status(200).json(updatedBooking);
    } catch (error) {
        return handleBookingError(res, error);
    }
};

// Quita todos los servicios asociados a una reserva.
export const clearBookingServices = async (req, res) => {
    try {
        const updatedBooking =
            await bookingsService.clearBookingServices(
                req.params.bid
            );

        return res.status(200).json(updatedBooking);
    } catch (error) {
        return handleBookingError(res, error);
    }
};

// Elimina una reserva completa.
export const deleteBooking = async (req, res) => {
    try {
        const deletedBooking =
            await bookingsService.deleteBooking(req.params.bid);

        return res.status(200).json(deletedBooking);
    } catch (error) {
        return handleBookingError(res, error);
    }
};