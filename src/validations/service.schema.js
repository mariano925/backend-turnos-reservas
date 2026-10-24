
import { z } from "zod";

// Reglas compartidas para los servicios.
const serviceFields = {
    name: z.string()
        .trim()
        .min(1, "El nombre es obligatorio"),

    description: z.string()
        .trim()
        .min(1, "La descripción es obligatoria"),

    duration: z.number()
        .min(5, "La duración mínima es de 5 minutos")
        .max(240, "La duración máxima es de 240 minutos"),

    price: z.number()
        .min(0, "El precio no puede ser negativo")
        .max(1000000, "El precio excede el límite permitido"),

    category: z.string()
        .trim()
        .min(1, "La categoría es obligatoria"),

    available: z.boolean()
};

// Crear: todos los campos son obligatorios.
export const createServiceSchema = z.object({
    ...serviceFields
}).strict();

// Actualizar: permite enviar solo los campos modificados.
export const updateServiceSchema = z.object({
    name: serviceFields.name.optional(),
    description: serviceFields.description.optional(),
    duration: serviceFields.duration.optional(),
    price: serviceFields.price.optional(),
    category: serviceFields.category.optional(),
    available: serviceFields.available.optional()
})
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe enviar al menos un campo para actualizar"
    );
