
 // Lógica de reservas
class BookingsService {

    constructor(bookingsRepository, servicesRepository) {
        this.bookingsRepository = bookingsRepository;
        this.servicesRepository = servicesRepository;
    }

    // Obtiene todas las reservas
    async getAllBookings() {
        return await this.bookingsRepository.getAll();
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

        // Obtiene el ID aunque el servicio esté poblado
        const serviceIndex = booking.services.findIndex((item) => {
            const currentServiceId =
                item.service?._id?.toString() ??
                item.service?.toString();

            return currentServiceId === serviceId.toString();
        });

        // Prepara las relaciones usando únicamente sus IDs
        const services = booking.services.map((item) => ({
            service: item.service?._id ?? item.service,
            quantity: item.quantity
        }));

        if (serviceIndex !== -1) {
            // Impide superar el máximo permitido
            if (services[serviceIndex].quantity >= 10) {
                throw new Error(
                    "La cantidad máxima por servicio es 10"
                );
            }

            // Incrementa la cantidad del servicio existente
            services[serviceIndex].quantity += 1;
        } else {
            // Agrega el servicio con cantidad inicial de 1
            services.push({
                service: serviceId,
                quantity: 1
            });
        }

        // Actualiza solamente los servicios de la reserva
        return await this.bookingsRepository.update(bookingId, {
            services
        });
    }
}

// Exportamos el Service
export default BookingsService;
