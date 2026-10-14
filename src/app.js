import express from "express";
import { engine } from "express-handlebars";
import path from "node:path";
import { fileURLToPath } from "node:url";

import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

// Resuelve la ubicación del proyecto a partir de este archivo.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura Handlebars como motor de vistas.
app.engine(
    "handlebars",
    engine({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Procesamiento de solicitudes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos: CSS y JavaScript del navegador.
app.use(express.static(path.join(__dirname, "../public")));

// Rutas de la API REST: se conservan.
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

// Rutas que renderizan páginas HTML.
app.use("/views", viewsRouter);

export default app;
