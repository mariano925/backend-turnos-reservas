const createServiceForm = document.getElementById("create-service-form");
const editServiceForm = document.getElementById("edit-service-form");
const editServiceDialog = document.getElementById("edit-service-dialog");
const servicesList = document.getElementById("services-list");

const serviceFeedback = document.getElementById("service-feedback");
const editFeedback = document.getElementById("edit-service-feedback");

function showFeedback(element, message, type = "success") {
    element.textContent = message;
    element.dataset.type = type;
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.error || `La operación falló (HTTP ${response.status}).`
        );
    }

    return data;
}

function getServicePayload(form) {
    return {
        name: form.elements.namedItem("name").value.trim(),
        description: form.elements.namedItem("description").value.trim(),
        duration: Number(form.elements.namedItem("duration").value),
        price: Number(form.elements.namedItem("price").value),
        category: form.elements.namedItem("category").value.trim(),
        available: form.elements.namedItem("available").checked
    };
}

function jsonOptions(method, body) {
    return {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
}

// Crea un servicio.
createServiceForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = createServiceForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;

    try {
        await apiRequest(
            "/api/services",
            jsonOptions("POST", getServicePayload(createServiceForm))
        );

        createServiceForm.reset();
        createServiceForm.elements.namedItem("available").checked = true;

        showFeedback(
            serviceFeedback,
            "Servicio creado correctamente."
        );

        // La lista se actualiza mediante el evento servicesUpdated de Socket.IO.
    } catch (error) {
        showFeedback(serviceFeedback, error.message, "error");
    } finally {
        submitButton.disabled = false;
    }
});

// Abre el formulario de edición usando los datos de la tarjeta.
servicesList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const card = button.closest(".service-card");

    if (!card) return;

    if (button.dataset.action === "edit-service") {
        editServiceForm.elements.namedItem("serviceId").value =
            card.dataset.serviceId;

        editServiceForm.elements.namedItem("name").value =
            card.dataset.name;

        editServiceForm.elements.namedItem("description").value =
            card.dataset.description;

        editServiceForm.elements.namedItem("duration").value =
            card.dataset.duration;

        editServiceForm.elements.namedItem("price").value =
            card.dataset.price;

        editServiceForm.elements.namedItem("category").value =
            card.dataset.category;

        editServiceForm.elements.namedItem("available").checked =
            card.dataset.available === "true";

        showFeedback(editFeedback, "");
        editServiceDialog.showModal();
        return;
    }

    if (button.dataset.action === "delete-service") {
        const serviceId = card.dataset.serviceId;
        const serviceName = card.dataset.name;

        const confirmed = window.confirm(
            `¿Eliminar el servicio "${serviceName}"?`
        );

        if (confirmed) {
            deleteService(serviceId, button);
        }
    }
});

// Guarda los cambios del formulario de edición.
editServiceForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const serviceId =
        editServiceForm.elements.namedItem("serviceId").value;

    const submitButton = editServiceForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;

    try {
        await apiRequest(
            `/api/services/${encodeURIComponent(serviceId)}`,
            jsonOptions("PUT", getServicePayload(editServiceForm))
        );

        editServiceDialog.close();

        showFeedback(
            serviceFeedback,
            "Servicio actualizado correctamente."
        );

        // Socket.IO actualiza las tarjetas con los datos nuevos.
    } catch (error) {
        showFeedback(editFeedback, error.message, "error");
    } finally {
        submitButton.disabled = false;
    }
});

async function deleteService(serviceId, button) {
    button.disabled = true;

    try {
        await apiRequest(
            `/api/services/${encodeURIComponent(serviceId)}`,
            { method: "DELETE" }
        );

        showFeedback(
            serviceFeedback,
            "Servicio eliminado correctamente."
        );

        // Socket.IO quita la tarjeta sin recargar la página.
    } catch (error) {
        showFeedback(serviceFeedback, error.message, "error");
        button.disabled = false;
    }
}

// Cierra el diálogo sin modificar el servicio.
document.getElementById("cancel-service-edit").addEventListener(
    "click",
    () => editServiceDialog.close()
);