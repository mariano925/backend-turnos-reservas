
 // Valida los datos antes de llegar al controlador.
export const validate = (schema, target = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[target]);

        // Detiene la petición si hay errores.
        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            return res.status(400).json({
                error: message
            });
        }

        // Usa los datos ya validados.
        req[target] = result.data;

        next();
    };
};
