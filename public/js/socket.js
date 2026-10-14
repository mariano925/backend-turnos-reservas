const socket = io();

// Escucha los cambios de servicios enviados por el servidor.
socket.on("servicesUpdated", (services) => {
    renderServices(services);
});

// Actualiza las tarjetas sin recargar la página.
function renderServices(services) {
    const container = document.getElementById("services-list");

    // Evita errores si la vista actual no muestra servicios.
    if (!container) return;

    container.replaceChildren();

    if (!services || services.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No hay servicios registrados.";
        container.appendChild(message);
        return;
    }

    services.forEach((service) => {
        const card = document.createElement("article");
        card.className = "service-card";

        const title = document.createElement("h3");
        title.textContent = service.name;

        const description = document.createElement("p");
        description.textContent = service.description;

        const details = document.createElement("dl");
        details.className = "service-details";

        // Construye cada dato del servicio de forma segura.
        const fields = [
            ["Duración", `${service.duration} minutos`],
            ["Precio", `$${service.price}`],
            ["Categoría", service.category],
            ["Disponibilidad", service.available ? "Disponible" : "No disponible"]
        ];

        fields.forEach(([label, value]) => {
            const wrapper = document.createElement("div");
            const term = document.createElement("dt");
            const detail = document.createElement("dd");

            term.textContent = label;
            detail.textContent = value;

            wrapper.append(term, detail);
            details.appendChild(wrapper);
        });

        card.append(title, description, details);
        container.appendChild(card);
    });
}