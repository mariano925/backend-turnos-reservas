import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

// Crea una reserva
export const createBooking = async (req, res) => {
    try {
        const newBooking = await bookingManager.createBooking(req.body);

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// Busca una reserva por ID
export const getBookingById = async (req, res) => {
    const id = Number(req.params.bid);

    const booking = await bookingManager.getBookingById(id);

    if (!booking) {
        return res.status(404).json({
            error: "Reserva no encontrada"
        });
    }

    res.status(200).json(booking);
};

// Agrega un servicio a una reserva
export const addServiceToBooking = async (req, res) => {
    try {
        const bookingId = Number(req.params.bid);
        const serviceId = Number(req.params.sid);

        const service = await serviceManager.getServiceById(serviceId);

        if (!service) {
            return res.status(404).json({
                error: "Servicio no encontrado"
            });
        }

        const updatedBooking =
            await bookingManager.addServiceToBooking(
                bookingId,
                serviceId
            );

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
};