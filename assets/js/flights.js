// assets/js/flights.js

document.addEventListener("DOMContentLoaded", () => {
    loadFlights();
  });
  
  async function loadFlights() {
    const tableBody = document.querySelector("#flights-table tbody");
    const errorEl = document.getElementById("flights-error");
  
    tableBody.innerHTML = "";
    errorEl.textContent = "Cargando vuelos...";
  
    try {
      const flights = await apiGet("/flights?limit=50");
  
      if (!flights.length) {
        errorEl.textContent = "No se han encontrado vuelos.";
        return;
      }
  
      errorEl.textContent = "";
      flights.forEach((f) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${f.id}</td>
          <td>${f.flight_no}</td>
          <td>${f.departure_airport}</td>
          <td>${f.arrival_airport}</td>
          <td>${formatDateTime(f.scheduled_departure)}</td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Error al cargar los vuelos.";
    }
  }
  
  function formatDateTime(datetimeString) {
    if (!datetimeString) return "";
    const d = new Date(datetimeString);
    if (isNaN(d.getTime())) return datetimeString;
    return d.toLocaleString();
  }
  