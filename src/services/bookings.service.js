// Lógica de reservas
class BookingsService {

    constructor(bookingsRepository, servicesRepository) {
        this.bookingsRepository = bookingsRepository;
        this.servicesRepository = servicesRepository;
    }

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

        return await this.bookingsRepository.create(newBooking);
    }

    // Busca una reserva por ID
    async getBookingById(id) {
        return await this.bookingsRepository.getById(id);
    }

    // Agrega un servicio a una reserva
    async addServiceToBooking(bookingId, serviceId) {

        // Busca la reserva
        const booking = await this.bookingsRepository.getById(bookingId);

        if (!booking) {
            throw new Error("Reserva no encontrada");
        }

        // Verifica que el servicio exista
        const service = await this.servicesRepository.getById(serviceId);

        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        // Busca si el servicio ya está agregado
        const serviceIndex = booking.services.findIndex(
            item => item.service.toString() === serviceId.toString()
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
        return await this.bookingsRepository.update(
            bookingId,
            booking
        );
    }
}

// Exportamos el Service
export default BookingsService;