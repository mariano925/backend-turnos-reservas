import dotenv from "dotenv";

dotenv.config();

// Variables necesarias
const requiredEnvVariables = ["PORT", "NODE_ENV"];

// Validamos
for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(`Falta la variable de entorno: ${variable}`);
    }
}

console.log("Variables de entorno cargadas correctamente.");