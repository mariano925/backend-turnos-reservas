// Modelo de reservas
import Booking from "../models/booking.model.js";

// DAO de reservas
class BookingsDAO {

    // Obtiene todas las reservas
    async getAll() {
        return await Booking.find().lean();
    }

    // Busca una reserva por ID
    async getById(id) {
        return await Booking.findById(id).lean();
    }

    // Crea una reserva
    async create(bookingData) {
        return await Booking.create(bookingData);
    }

    // Actualiza una reserva
    async update(id, updatedData) {
        return await Booking.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        ).lean();
    }
}

// Exportamos el DAO
export default BookingsDAO;