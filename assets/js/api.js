// assets/js/api.js

// ⚠️ AJUSTA ESTE PUERTO AL DE TU BACKEND
// Si run.py usa port=5002:
const API_BASE = "https://aiportdb-backend.onrender.com/api";
// Si cambias el puerto en run.py, cámbialo también aquí.

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

