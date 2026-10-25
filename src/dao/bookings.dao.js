import Booking from "../models/booking.model.js";

// DAO de reservas.
class BookingsDAO {
    // Obtiene todas las reservas con sus servicios asociados.
    async getAll() {
        return await Booking.find()
            .populate("services.service")
            .lean();
    }

    // Busca una reserva por ID con sus servicios asociados.
    async getById(id) {
        return await Booking.findById(id)
            .populate("services.service")
            .lean();
    }

    // Crea una reserva.
    async create(bookingData) {
        return await Booking.create(bookingData);
    }

    // Actualiza una reserva y ejecuta las validaciones del esquema.
    async update(id, updatedData) {
        return await Booking.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        )
            .populate("services.service")
            .lean();
    }

    // Elimina una reserva completa.
    async delete(id) {
        return await Booking.findByIdAndDelete(id).lean();
    }
}

export default BookingsDAO;