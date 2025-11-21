# Frontend – AirportDB Dashboard ✈️

Este repositorio contiene **solo el frontend** de mi proyecto **AirportDB Dashboard**.  
Es una interfaz web sencilla, hecha con **HTML, CSS y JavaScript puro**, que consume una API REST (backend en Flask) para:

- Mostrar un **dashboard** con métricas y una gráfica.
- Consultar un **catálogo de vuelos**.
- Gestionar **reservas** (crear, editar y eliminar) de forma visual.

El objetivo de este frontend es practicar:

- Consumo de API REST desde JavaScript.
- Organización básica de un proyecto web (HTML + CSS + JS).
- Maquetación tipo *dashboard* y despliegue en **GitHub Pages**.

---

## Tecnologías utilizadas

- **HTML5** – estructura de las páginas.
- **CSS3** – estilos, layout tipo dashboard y diseño oscuro.
- **JavaScript (ES6)** – consumo de la API y manipulación del DOM.
- **Chart.js** – para la gráfica de reservas por aerolínea en el dashboard.
- **Fetch API** – para hacer peticiones HTTP al backend.
- **GitHub Pages** – para el despliegue estático del frontend.

---

## Estructura del proyecto
.
├── index.html             # Dashboard principal
├── flights.html           # Listado de vuelos
├── reservations.html      # Gestión de reservas (CRUD)
└── assets/
    ├── css/
    │   └── style.css      # Estilos globales del dashboard
    └── js/
        ├── api.js         # Cliente genérico para la API (GET/POST/PUT/DELETE)
        ├── dashboard.js   # Lógica de la página index.html
        ├── flights.js     # Lógica de la página flights.html
        └── reservations.js# Lógica de la página reservations.html

- Cada página HTML tiene su script JS asociado.
- `style.css` define un diseño consistente: tema oscuro, tarjetas, tablas, botones, etc.
- `api.js` centraliza todas las llamadas a la API para no repetir código.

---

## Páginas del frontend

### index.html – Dashboard

Muestra tres tarjetas con métricas clave:

- Total de reservas.
- Importe total de las reservas.
- Número de vuelos distintos con reservas.

Incluye una gráfica de barras (Chart.js) con el número de reservas agrupadas por aerolínea.

Toda la información se obtiene de la API mediante el endpoint `GET /api/dashboard`.

---

### flights.html – Catálogo de vuelos

Muestra una tabla con los primeros vuelos devueltos por el backend:

- ID de vuelo.
- Número de vuelo.
- Origen (IATA).
- Destino (IATA).
- Fecha/hora de salida.

Sirve para que el usuario pueda consultar qué `flight_id` existen y usar esos IDs al crear reservas.

Usa el endpoint `GET /api/flights?limit=N`.

---

### reservations.html – Gestión de reservas (CRUD)

Muestra un formulario para:

- Crear nuevas reservas indicando:
  - `flight_id` (ID de un vuelo existente).
  - `amount` (importe en €).
  - `customer_name` (opcional).
  - `status` (confirmed / cancelled).
- Editar reservas existentes (el formulario se rellena al pulsar "Editar").

Debajo del formulario hay una tabla con todas las reservas:

- ID, vuelo, importe, fecha de reserva, estado y nombre de cliente.

Botones:

- **Editar** → carga la reserva en el formulario.
- **Eliminar** → borra la reserva mediante la API.

Usa los endpoints:

- `GET /api/reservations`
- `POST /api/reservations`
- `PUT /api/reservations/<id>`
- `DELETE /api/reservations/<id>`

---

## Integración con la API (backend)

Toda la comunicación con el backend se hace desde `assets/js/api.js`.
Aquí defino la URL base de la API y helpers para cada tipo de petición.

```js
// assets/js/api.js

// Se cambia esta constante según el entorno:
// - Local:      "http://localhost:5002/api"
// - Producción: "https://mi-backend.onrender.com/api"
const API_BASE = "https://mi-backend.onrender.com/api";

// Helper genérico para GET
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
  return res.json();
}

// Helper genérico para POST JSON
async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg;
    try {
      const errBody = await res.json();
      msg = errBody.error || `Error ${res.status}`;
    } catch {
      msg = `Error ${res.status}`;
    }
    throw new Error(msg);
  }

  return res.json();
}

// Helper genérico para PUT JSON
async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg;
    try {
      const errBody = await res.json();
      msg = errBody.error || `Error ${res.status}`;
    } catch {
      msg = `Error ${res.status}`;
    }
    throw new Error(msg);
  }

  return res.json();
}

// Helper genérico para DELETE
async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let msg;
    try {
      const errBody = await res.json();
      msg = errBody.error || `Error ${res.status}`;
    } catch {
      msg = `Error ${res.status}`;
    }
    throw new Error(msg);
  }

  return res.json();
}
```
Los demás scripts (`dashboard.js`, `flights.js`, `reservations.js`) solo se preocupan de:

- Llamar a `apiGet`/`apiPost`/`apiPut`/`apiDelete`.
- Rellenar la tabla, las tarjetas o la gráfica con los datos devueltos.

---

## Cómo ejecutar el frontend en local

**Nota:** para que funcione correctamente necesitas tener el backend levantado (por ejemplo en `http://localhost:5002/api`).

### 1. Clonar el repo

```bash
git clone <URL-del-repo-frontend>
cd airportdb-frontend
```

### 2. Configurar la URL de la API

Edita `assets/js/api.js` y pon la URL del backend que vayas a usar:

```js
// Para desarrollo local:
const API_BASE = "http://localhost:5002/api";
```

Guarda el archivo.

### 3. Servir los archivos estáticos

Tienes varias opciones:

#### Opción A – Live Server (VS Code)

- Abre la carpeta del proyecto en VS Code.
- Botón derecho sobre `index.html` → "Open with Live Server".
- Se abrirá algo tipo `http://127.0.0.1:5500/index.html`.

#### Opción B – Servidor simple con Python

```bash
python3 -m http.server 5500
```

Y luego abre en el navegador:

- `http://127.0.0.1:5500/index.html`
- `http://127.0.0.1:5500/flights.html`
- `http://127.0.0.1:5500/reservations.html`

---

## Despliegue en GitHub Pages

Para desplegar este frontend en GitHub Pages:

1. Asegúrate de que `index.html` está en la raíz del repositorio.
2. Configura `API_BASE` en `assets/js/api.js` con la URL del backend público, por ejemplo:

```js
const API_BASE = "https://mi-backend.onrender.com/api";
```

3. En GitHub:

   - Ir a **Settings → Pages**.
   - En "Build and deployment":
     - **Source**: Deploy from a branch.
     - **Branch**: main.
     - **Folder**: / (root).
   - Guardar y esperar a que GitHub genere la página.

La web quedará accesible en una URL del estilo:
https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/


A partir de ahí, la web funciona totalmente en el navegador y todas las operaciones (dashboard, vuelos y reservas) se realizan contra el backend mediante la API.

---

## Posibles mejoras futuras

Algunas ideas que podría añadir al frontend en el futuro:

- Filtros y búsqueda de vuelos por origen/destino.
- Paginación en tablas de vuelos y reservas.
- Validaciones más avanzadas en el formulario (fechas, rangos de importe, etc.).
- Mensajes de éxito/fracaso más visuales (toasts o banners).
- Modo claro/oscuro con un botón para cambiar de tema.

---

## Créditos

Diseño y desarrollo del frontend realizados por mí como parte del módulo de Acceso a Datos (2º DAM).

La API y la base de datos están basadas en el proyecto AirportDB / Flughafen DB (licencia CC BY 4.0).