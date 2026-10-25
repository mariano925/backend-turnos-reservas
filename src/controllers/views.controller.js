import ServicesService from "../services/services.service.js";
import ServicesRepository from "../repositories/services.repository.js";

import BookingsService from "../services/bookings.service.js";
import BookingsRepository from "../repositories/bookings.repository.js";

// Instancias de las capas de acceso a datos y lógica.
const servicesRepository = new ServicesRepository();
const servicesService = new ServicesService(servicesRepository);

const bookingsRepository = new BookingsRepository();
const bookingsService = new BookingsService(
    bookingsRepository,
    servicesRepository
);

// Renderiza el listado de servicios.
export const getServicesView = async (req, res) => {
    try {
        const services = await servicesService.getServices();

        res.render("services", {
            title: "Nuestros servicios",
            services
        });
    } catch (error) {
        console.error("Error al cargar la vista de servicios:", error.message);

        res.status(500).send("No se pudieron cargar los servicios.");
    }
};

// Renderiza las reservas registradas.
export const getAvailabilityView = async (req, res) => {
    try {
        const [bookings, services] = await Promise.all([
            bookingsService.getAllBookings(),
            servicesService.getServices()
        ]);

        res.render("availability", {
            title: "Disponibilidad de turnos",
            bookings,
            services
        });
    } catch (error) {
        console.error("Error al cargar la vista de reservas:", error.message);

        res.status(500).send("No se pudieron cargar las reservas.");
    }
};