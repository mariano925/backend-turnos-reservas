// Logica de reservas

const normalizeId = (value) => value?.toString().toLowerCase();

const getBookingServiceId = (item) =>
    normalizeId(item.service?._id ?? item.service);

const normalizeBookingServices = (services) =>
    services.map((item) => ({
        service: item.service?._id ?? item.service,
        quantity: item.quantity
    }));

class BookingsService {
    constructor(bookingsRepository, servicesRepository) {
        this.bookingsRepository = bookingsRepository;
        this.servicesRepository = servicesRepository;
    }

    // Obtiene todas las reservas.
    async getAllBookings() {
        return await this.bookingsRepository.getAll();
    }

    // Valida y crea una reserva.
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

    // Busca una reserva por ID.
    async getBookingById(id) {
        return await this.bookingsRepository.getById(id);
    }

    // Agrega un servicio o incrementa su cantidad.
    async addServiceToBooking(bookingId, serviceId) {
        const booking = await this.bookingsRepository.getById(bookingId);

        if (!booking) {
            throw new Error("Reserva no encontrada");
        }

        const service = await this.servicesRepository.getById(serviceId);

        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        const services = normalizeBookingServices(booking.services);
        const serviceIndex = services.findIndex(
            (item) =>
                normalizeId(item.service) === normalizeId(serviceId)
        );

        if (serviceIndex !== -1) {
            if (services[serviceIndex].quantity >= 10) {
                throw new Error(
                    "La cantidad máxima por servicio es 10"
                );
            }

            services[serviceIndex].quantity += 1;
        } else {
            services.push({
                service: serviceId,
                quantity: 1
            });
        }

        return await this.bookingsRepository.update(bookingId, {
            services
        });
    }

    // Elimina un servicio específico de una reserva.
    async removeServiceFromBooking(bookingId, serviceId) {
        const booking = await this.bookingsRepository.getById(bookingId);

        if (!booking) {
            throw new Error("Reserva no encontrada");
        }

        const serviceExists = booking.services.some(
            (item) =>
                getBookingServiceId(item) === normalizeId(serviceId)
        );

        if (!serviceExists) {
            throw new Error("Servicio no asociado a la reserva");
        }

        const services = normalizeBookingServices(
            booking.services.filter(
                (item) =>
                    getBookingServiceId(item) !== normalizeId(serviceId)
            )
        );

        return await this.bookingsRepository.update(bookingId, {
            services
        });
    }

    // Establece una cantidad concreta para un servicio asociado.
    async setBookingServiceQuantity(bookingId, serviceId, quantity) {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
            throw new Error(
                "La cantidad debe ser un entero entre 1 y 10"
            );
        }

        const booking = await this.bookingsRepository.getById(bookingId);

        if (!booking) {
            throw new Error("Reserva no encontrada");
        }

        const services = normalizeBookingServices(booking.services);
        const serviceIndex = services.findIndex(
            (item) =>
                normalizeId(item.service) === normalizeId(serviceId)
        );

        if (serviceIndex === -1) {
            throw new Error("Servicio no asociado a la reserva");
        }

        services[serviceIndex].quantity = quantity;

        return await this.bookingsRepository.update(bookingId, {
            services
        });
    }

    // Vacía los servicios asociados a una reserva.
    async clearBookingServices(bookingId) {
        const booking = await this.bookingsRepository.getById(bookingId);

        if (!booking) {
            throw new Error("Reserva no encontrada");
        }

        return await this.bookingsRepository.update(bookingId, {
            services: []
        });
    }

    // Elimina una reserva completa.
    async deleteBooking(bookingId) {
        const deletedBooking =
            await this.bookingsRepository.delete(bookingId);

        if (!deletedBooking) {
            throw new Error("Reserva no encontrada");
        }

        return deletedBooking;
    }
}

export default BookingsService;