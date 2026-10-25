const socket = io();

// Escucha los cambios de servicios enviados por el servidor.
socket.on("servicesUpdated", (services) => {
    renderServices(services);
});

function createActionButton(label, action, className) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `button ${className}`;
    button.dataset.action = action;
    button.textContent = label;

    return button;
}

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

        // Conserva los datos necesarios para abrir el formulario de edición.
        card.dataset.serviceId = service._id ?? "";
        card.dataset.name = service.name ?? "";
        card.dataset.description = service.description ?? "";
        card.dataset.duration = String(service.duration ?? "");
        card.dataset.price = String(service.price ?? "");
        card.dataset.category = service.category ?? "";
        card.dataset.available = String(Boolean(service.available));

        const title = document.createElement("h3");
        title.textContent = service.name;

        const description = document.createElement("p");
        description.textContent = service.description;

        const details = document.createElement("dl");
        details.className = "service-details";

        const fields = [
            ["Duración", `${service.duration} minutos`],
            ["Precio", `$${service.price}`],
            ["Categoría", service.category],
            [
                "Disponibilidad",
                service.available ? "Disponible" : "No disponible"
            ]
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

        const actions = document.createElement("div");
        actions.className = "card-actions";

        actions.append(
            createActionButton(
                "Editar",
                "edit-service",
                "button-secondary"
            ),
            createActionButton(
                "Eliminar",
                "delete-service",
                "button-danger"
            )
        );

        card.append(title, description, details, actions);
        container.appendChild(card);
    });
}