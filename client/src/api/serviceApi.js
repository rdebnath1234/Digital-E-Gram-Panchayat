import { request } from "./client";

export const serviceApi = {
  list: (search = "") => request(`/services?search=${encodeURIComponent(search)}`),
  create: (payload) => request("/services", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/services/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/services/${id}`, { method: "DELETE" })
};
