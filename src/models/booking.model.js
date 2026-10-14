
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    clientName: {
        type: String,
        required: true
    },

    clientEmail: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "El formato del correo electrónico es inválido"
        ]
    },

    date: {
        type: String,
        required: [true, "La fecha es obligatoria"],
        match: [
            /^\d{4}-\d{2}-\d{2}$/,
            "Formato de fecha inválido. Use YYYY-MM-DD"
        ],
        validate: {
            validator: function (value) {
                if (!value) return true;

                const [year, month, day] = value.split("-").map(Number);

                // Comprueba la fecha sin aceptar desbordes del calendario.
                const parsedDate = new Date(0);
                parsedDate.setHours(0, 0, 0, 0);
                parsedDate.setFullYear(year, month - 1, day);

                return (
                    !Number.isNaN(parsedDate.getTime()) &&
                    parsedDate.getFullYear() === year &&
                    parsedDate.getMonth() === month - 1 &&
                    parsedDate.getDate() === day
                );
            },
            message: "La fecha ingresada no existe en el calendario"
        }
    },

    time: {
        type: String,
        required: [true, "La hora es obligatoria"],
        match: [
            /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Formato de hora inválido. Use HH:mm (24 horas)"
        ]
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        required: true
    },

    services: [
        {
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
                required: true
            },

            quantity: {
                type: Number,
                required: [true, "La cantidad es obligatoria"],
                // Evita cantidades inválidas o excesivas por servicio.
                min: [1, "La cantidad mínima es 1"],
                max: [10, "La cantidad máxima por servicio es 10"]
            }
        }
    ]
});

export default mongoose.model("Booking", bookingSchema);
