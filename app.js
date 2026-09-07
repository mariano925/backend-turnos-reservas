import express from "express";

import servicesRouter from "./src/routes/services.router.js";
import bookingsRouter from "./src/routes/bookings.router.js";

const app = express();

app.use(express.json());

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

export default app;

