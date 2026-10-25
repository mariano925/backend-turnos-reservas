import { z } from "zod";

// Valida el formato y la existencia de la fecha.
const dateSchema = z.string()
    .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Use el formato YYYY-MM-DD"
    )
    .refine((value) => {
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(0);

        date.setUTCHours(0, 0, 0, 0);
        date.setUTCFullYear(year, month - 1, day);

        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    }, "La fecha ingresada no existe en el calendario");

// Valida los datos necesarios para crear una reserva.
export const createBookingSchema = z.object({
    clientName: z.string()
        .trim()
        .min(1, "El nombre del cliente es obligatorio"),

    clientEmail: z.string()
        .trim()
        .email("El correo electrónico no es válido"),

    date: dateSchema,

    time: z.string()
        .regex(
            /^(?:[01]\d|2[0-3]):[0-5]\d$/,
            "Use el formato HH:mm (24 horas)"
        ),

    status: z.enum([
        "pending",
        "confirmed",
        "cancelled"
    ])
}).strict();

// Valida los IDs de la reserva y del servicio.
export const bookingServiceParamsSchema = z.object({
    bid: z.string()
        .regex(
            /^[a-f\d]{24}$/i,
            "El ID de la reserva no es válido"
        ),

    sid: z.string()
        .regex(
            /^[a-f\d]{24}$/i,
            "El ID del servicio no es válido"
        )
}).strict();

// Valida el ID de una reserva para operaciones individuales.
export const bookingIdParamsSchema = z.object({
    bid: z.string()
        .regex(
            /^[a-f\d]{24}$/i,
            "El ID de la reserva no es válido"
        )
}).strict();

// Valida la cantidad específica de un servicio en una reserva.
export const setBookingServiceQuantitySchema = z.object({
    quantity: z.number()
        .int("La cantidad debe ser un número entero")
        .min(1, "La cantidad mínima es 1")
        .max(10, "La cantidad máxima por servicio es 10")
}).strict();