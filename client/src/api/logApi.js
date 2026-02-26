import { request } from "./client";

export const logApi = {
  list: () => request("/logs")
};
