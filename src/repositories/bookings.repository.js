// DAO de reservas
import BookingsDAO from "../dao/bookings.dao.js";

// Repository de reservas
class BookingsRepository {

    constructor() {
        this.dao = new BookingsDAO();
    }

    // Crea una reserva
    async create(bookingData) {
        return await this.dao.create(bookingData);
    }

    // Busca una reserva por ID
    async getById(id) {
        return await this.dao.getById(id);
    }

    // Actualiza una reserva
    async update(id, updatedData) {
        return await this.dao.update(id, updatedData);
    }
}

// Exportamos el Repository
export default BookingsRepository;