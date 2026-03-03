import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/";

/**
 * Fetch health check status from django-health-check.
 * Returns { status: "ok"|"error", services: { name: "working"|"unavailable" }[] }
 */
export async function fetchHealth() {
  try {
    const { data, status } = await axios.get(`${BASE_URL}health/`, {
      headers: { Accept: "application/json" },
      // Don't throw on 500 — health check returns 500 when a service is down
      validateStatus: (s) => s < 600,
    });

    const services = Object.entries(data).map(([name, value]) => ({
      name,
      ok: String(value).toLowerCase().includes("working"),
      detail: value,
    }));

    return {
      ok: status === 200,
      services,
    };
  } catch (err) {
    return {
      ok: false,
      services: [{ name: "Backend", ok: false, detail: "Unreachable" }],
    };
  }
}
