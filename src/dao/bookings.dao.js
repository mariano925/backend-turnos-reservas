// Herramientas para archivos
import { readFile, writeFile } from "fs/promises";

// Ruta del JSON
const filePath = new URL("../data/bookings.json", import.meta.url);

// DAO de reservas
class BookingsDAO {

    // Lee todas las reservas
    async getAll() {
        const data = await readFile(filePath, "utf-8");

        return JSON.parse(data);
    }

    // Busca una reserva por ID
    async getById(id) {
        const bookings = await this.getAll();

        return bookings.find(booking => booking.id === id) || null;
    }

    // Crea y guarda una reserva
    async create(bookingData) {
        const bookings = await this.getAll();

        const newId = bookings.length > 0
            ? Math.max(...bookings.map(booking => booking.id)) + 1
            : 1;

        const newBooking = {
            id: newId,
            ...bookingData
        };

        bookings.push(newBooking);

        await writeFile(
            filePath,
            JSON.stringify(bookings, null, 2)
        );

        return newBooking;
    }

    // Actualiza y guarda una reserva
    async update(id, updatedData) {
        const bookings = await this.getAll();

        const bookingIndex = bookings.findIndex(
            booking => booking.id === id
        );

        if (bookingIndex === -1) {
            return null;
        }

        bookings[bookingIndex] = {
            ...bookings[bookingIndex],
            ...updatedData,
            id
        };

        await writeFile(
            filePath,
            JSON.stringify(bookings, null, 2)
        );

        return bookings[bookingIndex];
    }
}

// Exportamos el DAO
export default BookingsDAO;