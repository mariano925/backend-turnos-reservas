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

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;

console.log("Variables de entorno cargadas correctamente.");