import dotenv from "dotenv";

dotenv.config();

// Variables necesarias
const requiredEnvVariables = ["PORT", "MONGODB_URI"];

// Validamos
for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(`Falta la variable de entorno: ${variable}`);
    }
}

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;

console.log("Variables de entorno cargadas correctamente.");