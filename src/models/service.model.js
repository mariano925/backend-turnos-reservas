
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: [true, "La duración es obligatoria"],
        // Límites técnicos para evitar duraciones absurdas.
        min: [5, "La duración mínima es de 5 minutos"],
        max: [240, "La duración máxima es de 240 minutos"]
    },

    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        // Permite cortesías y limita errores de tipeo.
        min: [0, "El precio no puede ser negativo"],
        max: [1000000, "El precio excede el límite técnico permitido"]
    },

    category: {
        type: String,
        required: true
    },

    available: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Service", serviceSchema);
