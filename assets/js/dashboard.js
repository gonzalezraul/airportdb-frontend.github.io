// assets/js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
  });
  
  async function loadDashboard() {
    const statsEl = document.getElementById("stats");
    const errorEl = document.getElementById("dashboard-error");
    const ctx = document.getElementById("airlineChart").getContext("2d");
  
    errorEl.textContent = "";
    statsEl.classList.add("loading");
  
    try {
      const data = await apiGet("/dashboard");
  
      const { stats, reservations_by_airline } = data;
  
      // Tarjetas
      document.getElementById("total-reservations").textContent =
        stats.total_reservations;
      document.getElementById("total-amount").textContent =
        stats.total_amount.toFixed(2) + " €";
      document.getElementById("flights-with-res").textContent =
        stats.flights_with_reservations;
  
      // Gráfica sencilla por aerolínea
      const labels = reservations_by_airline.map((item) => item.airline);
      const values = reservations_by_airline.map((item) => item.count);
  
      // Usamos Chart.js desde CDN
      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Reservas por aerolínea",
              data: values,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    } catch (err) {
      console.error(err);
      errorEl.textContent = "No se ha podido cargar el dashboard.";
    } finally {
      statsEl.classList.remove("loading");
    }
  }
