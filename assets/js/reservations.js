// assets/js/reservations.js

document.addEventListener("DOMContentLoaded", () => {
  initReservationPage();
});

function initReservationPage() {
  const form = document.getElementById("reservation-form");
  const resetBtn = document.getElementById("reset-btn");

  form.addEventListener("submit", onSubmitReservationForm);
  resetBtn.addEventListener("click", resetForm);

  loadReservations();
}

async function loadReservations() {
  const tbody = document.querySelector("#reservations-table tbody");
  tbody.innerHTML = '<tr><td colspan="7">Cargando reservas...</td></tr>';

  try {
    const data = await apiGet("/reservations");

    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No hay reservas registradas.</td></tr>';
      return;
    }

    tbody.innerHTML = "";
    data.forEach((res) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${res.id}</td>
        <td>${res.flight_id}</td>
        <td>${res.amount.toFixed ? res.amount.toFixed(2) : res.amount}</td>
        <td>${res.booking_date ? res.booking_date.replace("T", " ").substring(0, 19) : ""}</td>
        <td>${res.status}</td>
        <td>${res.customer_name || ""}</td>
        <td>
          <button class="btn-edit" data-id="${res.id}">Editar</button>
          <button class="btn-delete" data-id="${res.id}">Eliminar</button>
        </td>
      `;

      const editBtn = tr.querySelector(".btn-edit");
      const deleteBtn = tr.querySelector(".btn-delete");

      editBtn.addEventListener("click", () => onEditReservation(res.id));
      deleteBtn.addEventListener("click", () => onDeleteReservation(res.id));

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error al cargar reservas:", err);
    tbody.innerHTML = `<tr><td colspan="7">Error al cargar reservas: ${err.message}</td></tr>`;
  }
}

async function onSubmitReservationForm(event) {
  event.preventDefault();

  const idInput = document.getElementById("reservation_id");
  const flightIdInput = document.getElementById("flight_id");
  const amountInput = document.getElementById("amount");
  const customerNameInput = document.getElementById("customer_name");
  const statusInput = document.getElementById("status");

  const reservationId = idInput.value ? parseInt(idInput.value, 10) : null;
  const flightId = flightIdInput.value.trim();
  const amount = amountInput.value.trim();
  const customerName = customerNameInput.value.trim();
  const status = statusInput.value;

  if (!flightId || !amount) {
    alert("Debes indicar flight_id y amount.");
    return;
  }

  const payload = {
    flight_id: flightId,
    amount: amount,
    customer_name: customerName || null,
    status: status,
  };

  try {
    if (reservationId === null) {
      // Crear
      await apiPost("/reservations", payload);
      alert("Reserva creada correctamente.");
    } else {
      // Actualizar
      await apiPut(`/reservations/${reservationId}`, payload);
      alert("Reserva actualizada correctamente.");
    }

    resetForm();
    await loadReservations();
  } catch (err) {
    console.error("Error al guardar reserva:", err);
    alert("Error al guardar la reserva: " + err.message);
  }
}

async function onEditReservation(resId) {
  try {
    // Pedimos la reserva concreta
    const res = await apiGet(`/reservations/${resId}`);

    document.getElementById("reservation_id").value = res.id;
    document.getElementById("flight_id").value = res.flight_id;
    document.getElementById("amount").value = res.amount;
    document.getElementById("customer_name").value = res.customer_name || "";
    document.getElementById("status").value = res.status || "confirmed";

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Error al cargar la reserva para edición:", err);
    alert("No se pudo cargar la reserva para edición.");
  }
}

async function onDeleteReservation(resId) {
  const confirmDelete = confirm(`¿Seguro que quieres eliminar la reserva #${resId}?`);
  if (!confirmDelete) return;

  try {
    await apiDelete(`/reservations/${resId}`);
    alert("Reserva eliminada correctamente.");
    await loadReservations();
  } catch (err) {
    console.error("Error al eliminar reserva:", err);
    alert("Error al eliminar la reserva: " + err.message);
  }
}

function resetForm() {
  document.getElementById("reservation_id").value = "";
  document.getElementById("flight_id").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("customer_name").value = "";
  document.getElementById("status").value = "confirmed";
}
