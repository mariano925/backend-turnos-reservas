import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config.js";

// Conecta la aplicación con MongoDB Atlas
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log("Conexión a MongoDB establecida correctamente.");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
};