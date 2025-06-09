const url = import.meta.env.VITE_API_BASE_URL

export const baseURL = url.endsWith('/') ? url + "api" : url + "/api";

