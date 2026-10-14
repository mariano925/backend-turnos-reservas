import { createServer } from "node:http";
import { Server } from "socket.io";

import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";
import app from "./app.js";

// Crea el servidor HTTP que compartirán Express y Socket.io.
const httpServer = createServer(app);
const io = new Server(httpServer);

// Permite acceder a Socket.io desde los controladores.
app.set("io", io);

// Gestiona las conexiones de los clientes en tiempo real.
io.on("connection", (socket) => {
    console.log(`Cliente conectado a Socket.io: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Conecta con MongoDB y luego inicia el servidor.
const startServer = async () => {
    try {
        await connectDB();

        httpServer.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error.message);
        process.exitCode = 1;
    }
};

startServer();