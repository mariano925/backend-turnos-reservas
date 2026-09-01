import express from "express";
import servicesRouter from "./src/routes/services.router.js"; // Importa rutas

const app = express();
app.use(express.json()); // Lee JSON del body
app.use("/api/services", servicesRouter); // Conecta las rutas

export default app;