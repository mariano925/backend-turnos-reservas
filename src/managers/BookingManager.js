// Herramientas para archivos
import { readFile, writeFile } from "fs/promises";

// Manager de servicios
import ServiceManager from "./ServiceManager.js";

// Ruta del JSON
const filePath = new URL("../data/bookings.json", import.meta.url);

// Administramos las reservas
class BookingManager {

    // Obtener todas
    async getBookings() {
        const data = await readFile(filePath, "utf-8");
        return JSON.parse(data);
    }

    // Buscar por ID
    async getBookingById(id) {
        const bookings = await this.getBookings();

        return bookings.find(booking => booking.id === id) || null;
    }

    // Crear reserva
    async createBooking(bookingData) {
        const requiredFields = [
            "clientName",
            "clientEmail",
            "date",
            "time",
            "status"
        ];

        // Validar campos
        for (const field of requiredFields) {
            if (bookingData[field] === undefined) {
                throw new Error(`Falta el campo: ${field}`);
            }
        }

        const bookings = await this.getBookings();

        // Generar ID
        const newId = bookings.length > 0
            ? Math.max(...bookings.map(booking => booking.id)) + 1
            : 1;

        // Crear reserva
        const newBooking = {
            id: newId,
            ...bookingData,
            services: []
        };

        bookings.push(newBooking);

        // Guardar cambios
        await writeFile(
            filePath,
            JSON.stringify(bookings, null, 2)
        );

        return newBooking;
    }

    // Agregar servicio
    async addServiceToBooking(bookingId, serviceId) {
        const bookings = await this.getBookings();

        // Buscar reserva
        const booking = bookings.find(
            booking => booking.id === bookingId
        );

        if (!booking) {
            throw new Error("Reserva no encontrada");
        }

        // Verificar servicio
        const serviceManager = new ServiceManager();
        const service = await serviceManager.getServiceById(serviceId);

        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        // Buscar si ya existe
        const serviceIndex = booking.services.findIndex(
            item => item.service === serviceId
        );

        // Aumentar cantidad
        if (serviceIndex !== -1) {
            booking.services[serviceIndex].quantity += 1;
        } else {
            // Agregar servicio
            booking.services.push({
                service: serviceId,
                quantity: 1
            });
        }

        // Guardar cambios
        await writeFile(
            filePath,
            JSON.stringify(bookings, null, 2)
        );

        return booking;
    }
}

// Exportamos la clase
export default BookingManager;

