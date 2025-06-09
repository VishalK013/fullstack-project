import axios from "axios";
import momentTz from "moment-timezone";
import { baseURL } from "../common/util";
import { handleLogOut } from "./LogOutHandler";


export const AccessToken = {
    get() {
        return window.localStorage.getItem("token");
    },
    set(token) {
        window.localStorage.set("token", token);
    },
    remove() {
        window.localStorage.remove("token");
    },
};

export const isAuthenticated = () => !!AccessToken.get();

// Axios instance
export const instance = axios.create({
    baseURL,
    timeout: 90000,
    responseType: "json",
    validateStatus: false,
    headers: {
        "Content-Type": "application/json",
        "tz": `${momentTz.tz.guess()}`
    },
});

// Interceptors both request and response
instance.interceptors.request.use((config) => {
    const token = AccessToken.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const baseUrl = config.baseURL || "";
    const url = new URL(config.url, baseUrl);

    if (config.params) {
        const queryString = new URLSearchParams(config.params).toString();
        url.search = queryString;
    }

    console.log("📡 Axios Request URL:", url.toString());
    console.log("📦 Headers:", config.headers);

    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            handleLogOut();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// GET
function get(url, paramObj = {}, headers = {}) {
    return instance
        .get(url, { params: paramObj, headers })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                return response.data;
            } else if (response.status === 401) {
                return {
                    ...response.data,
                    status: false,
                    unauthenticated: true,
                    redirect_to_login: true,
                };
            } else if (response.status === 404) {
                return {
                    ...response.data,
                    status: false,
                    isRecordFound: false,
                };
            }
            return {
                success: false,
                message: response.message || "Ill formed response!",
                redirect_to_login: true,
            };
        })
        .then((response) => response)
        .catch((error) => {
            const message = error?.response?.data?.message || error?.message || "An error occurred. Please try again.";
            const err = new Error(message);
            err.response = error.response;
            throw err;
        });
}

// POST
function post(url, paramObj, token = null) {
    let headers = { "Content-Type": "application/json" };
    const authToken = token || AccessToken.get();
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    if (paramObj instanceof FormData) headers["Content-Type"] = "multipart/form-data";

    return instance
        .post(url, paramObj, { headers })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                return response.data;
            } else {
                const error = new Error(response?.data?.message || response?.statusText || "Request failed");
                error.response = response;
                throw error;
            }
        })
        .catch((error) => {
            const message = error?.response?.data?.message || error?.message || "An error occurred. Please try again.";
            const err = new Error(message);
            err.response = error.response;
            throw err;
        });
}

function update(url, paramObj) {
    return instance
        .put(url, paramObj)
        .then((response) => {
            switch (response.status) {
                case 200:
                case 201:
                    return { success: true, data: response.data };
                case 401:
                    return { success: false, unauthenticated: true };
                case 422:
                    return { success: false, data: response.data };
                default:
                    return { success: false, message: response };
            }
        })
        .then((response) => ({
            ...(response?.data || {}),
            success: response?.success || false,
        }))
        .catch((error) => {
            const message = error?.response?.data?.message || error?.message || "An error occurred. Please try again.";
            const err = new Error(message);
            err.response = error.response;
            throw err;
        });
}

// PUT 
function put(url, paramObj, token = null) {
    let headers = {};
    const authToken = token || AccessToken.get();
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    if (!(paramObj instanceof FormData)) headers["Content-Type"] = "application/json";

    return instance
        .put(url, paramObj, { headers })
        .then((response) => response.data)
        .catch((error) => {
            const message = error?.response?.data?.message || error?.message || "An error occurred. Please try again.";
            const err = new Error(message);
            err.response = error.response;
            throw err;
        });
}

// DELETE
function deleteM(url, paramObj) {
    return instance
        .delete(url, {
            data: paramObj,
            responseType: "json",
            validateStatus: false,
        })
        .then((response) => {
            console.log("🗑️ Delete API response:", response);
            return response.data;
        })
        .catch((error) => {
            console.error("Delete error:", error.response?.data || error.message);
            throw error;
        });
}

// PATCH
function patch(url, paramObj, token) {
    if (token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return instance
        .patch(url, paramObj)
        .then((response) => {
            console.log("🩹 Patch API response:", response);
            return response.data;
        })
        .then((response) => response)
        .catch((error) => {
            const message = error?.response?.data?.message || error?.message || "An error occurred. Please try again.";
            const err = new Error(message);
            err.response = error.response;
            throw err;
        });
}

// Export
export default {
    instance,
    get,
    post,
    patch,
    update,
    delete: deleteM,
    put,
    baseURL,
};
