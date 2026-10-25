const feedback = document.querySelector("#booking-feedback");
const createForm = document.querySelector("#booking-create-form");

function showFeedback(message, type = "success") {
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.remove("is-success", "is-error");
  feedback.classList.add(type === "error" ? "is-error" : "is-success");
}

async function apiRequest(url, options = {}) {
  const requestOptions = {
    method: options.method || "GET",
    headers: {},
  };

  if (options.body !== undefined) {
    requestOptions.headers["Content-Type"] = "application/json";
    requestOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, requestOptions);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.message ||
      `La solicitud falló (${response.status}).`;

    throw new Error(message);
  }

  return data;
}

function reloadAfterSuccess(message) {
  showFeedback(message);
  window.setTimeout(() => window.location.reload(), 900);
}

if (createForm) {
  createForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = createForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const formData = new FormData(createForm);
    const booking = Object.fromEntries(formData.entries());

    try {
      await apiRequest("/api/bookings", {
        method: "POST",
        body: booking,
      });

      reloadAfterSuccess("Reserva creada correctamente.");
    } catch (error) {
      showFeedback(error.message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

document.addEventListener("submit", async (event) => {
  const addForm = event.target.closest(".booking-add-service-form");
  const quantityForm = event.target.closest(".booking-quantity-form");
  const form = addForm || quantityForm;

  if (!form) return;

  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  const bookingId = form.dataset.bookingId;
  const formData = new FormData(form);

  try {
    if (addForm) {
      const serviceId = formData.get("serviceId");

      if (!serviceId) {
        throw new Error("Seleccioná un servicio.");
      }

      await apiRequest(
        `/api/bookings/${bookingId}/services/${serviceId}`,
        { method: "POST" }
      );

      reloadAfterSuccess("Servicio agregado a la reserva.");
      return;
    }

    const serviceId = form.dataset.serviceId;
    const quantity = Number(formData.get("quantity"));

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      throw new Error("La cantidad debe ser un entero entre 1 y 10.");
    }

    await apiRequest(
      `/api/bookings/${bookingId}/services/${serviceId}`,
      {
        method: "PATCH",
        body: { quantity },
      }
    );

    reloadAfterSuccess("Cantidad actualizada correctamente.");
  } catch (error) {
    showFeedback(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-booking-action]");

  if (!button) return;

  const action = button.dataset.bookingAction;
  const bookingId = button.dataset.bookingId;
  const serviceId = button.dataset.serviceId;

  const messages = {
    "remove-service": "¿Querés quitar este servicio de la reserva?",
    "clear-services": "¿Querés quitar todos los servicios de esta reserva?",
    "delete-booking": "¿Confirmás que querés eliminar esta reserva?",
  };

  if (!messages[action]) return;
  if (!window.confirm(messages[action])) return;

  let url = `/api/bookings/${bookingId}`;
  let successMessage = "Operación completada correctamente.";

  if (action === "remove-service") {
    url += `/services/${serviceId}`;
    successMessage = "Servicio quitado de la reserva.";
  }

  if (action === "clear-services") {
    url += "/services";
    successMessage = "Se quitaron todos los servicios de la reserva.";
  }

  if (action === "delete-booking") {
    successMessage = "Reserva eliminada correctamente.";
  }

  button.disabled = true;

  try {
    await apiRequest(url, { method: "DELETE" });
    reloadAfterSuccess(successMessage);
  } catch (error) {
    showFeedback(error.message, "error");
  } finally {
    button.disabled = false;
  }
});