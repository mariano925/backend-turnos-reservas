// Repositorio de reservas.
import BookingsDAO from "../dao/bookings.dao.js";

class BookingsRepository {
    constructor() {
        this.dao = new BookingsDAO();
    }

    // Obtiene todas las reservas.
    async getAll() {
        return await this.dao.getAll();
    }

    // Crea una reserva.
    async create(bookingData) {
        return await this.dao.create(bookingData);
    }

    // Busca una reserva por ID.
    async getById(id) {
        return await this.dao.getById(id);
    }

    // Actualiza una reserva.
    async update(id, updatedData) {
        return await this.dao.update(id, updatedData);
    }

    // Elimina una reserva por ID.
    async delete(id) {
        return await this.dao.delete(id);
    }
}

export default BookingsRepository;