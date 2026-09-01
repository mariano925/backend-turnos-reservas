import { PORT } from "./src/config/env.config.js";
import app from "./app.js";

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});