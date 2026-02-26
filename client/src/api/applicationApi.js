import { request } from "./client";

export const applicationApi = {
  apply: (payload) => request("/applications", { method: "POST", body: JSON.stringify(payload) }),
  mine: () => request("/applications/me"),
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
};
