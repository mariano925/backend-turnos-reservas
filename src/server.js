import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";
import app from "./app.js";

// Conecta con MongoDB y luego inicia el servidor
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
};

startServer();