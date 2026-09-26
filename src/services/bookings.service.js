// Repositories de reservas y servicios
import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

// Instancias de los repositories
const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

// Lógica de reservas
class BookingsService {

    // Valida y crea una reserva
    async createBooking(bookingData) {
        const requiredFields = [
            "clientName",
            "clientEmail",
            "date",
            "time",
            "status"
        ];

        for (const field of requiredFields) {
            if (bookingData[field] === undefined) {
                throw new Error(`Falta el campo: ${field}`);
            }
        }

        const newBooking = {
            ...bookingData,
            services: []
        };

        return await bookingsRepository.create(newBooking);
    }

    // Busca una reserva por ID
    async getBookingById(id) {
        return await bookingsRepository.getById(id);
    }

    // Agrega un servicio a una reserva
    async addServiceToBooking(bookingId, serviceId) {

        // Busca la reserva
        const booking = await bookingsRepository.getById(bookingId);

        if (!booking) {
            throw new Error("Reserva no encontrada");
        }

        // Verifica que el servicio exista
        const service = await servicesRepository.getById(serviceId);

        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        // Busca si el servicio ya está agregado
        const serviceIndex = booking.services.findIndex(
            item => item.service === serviceId
        );

        if (serviceIndex !== -1) {

            // Aumenta la cantidad
            booking.services[serviceIndex].quantity += 1;

        } else {

            // Agrega el servicio
            booking.services.push({
                service: serviceId,
                quantity: 1
            });
        }

        // Guarda la reserva actualizada
        return await bookingsRepository.update(
            bookingId,
            booking
        );
    }
}

// Exportamos el Service
export default BookingsService;