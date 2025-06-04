import axios from "axios";
import momentTz from "moment-timezone"
import { baseURL } from "../common/util";

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

function get(url, paramObj = {}, headers = {}) {

    instance.defaults.headers.common["Authorization"] = `Bearer ${AccessToken.get()}`;

    return instance
        .get(url, { params: paramObj })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                return response.data;
            } else if (response.status === 401) {
                return {
                    ...response.data,
                    status: false,
                    response_status: response.status,
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
        .then((response) => {
            if (response.success) {
                return response;
            } else {
                return response;
            }
        })
        .catch((error) => {
            return {
                status: false,
                message: error.message || "Something went wrong! Try again later",
            };
        });
}

function post(url, paramObj, token) {

    instance.defaults.headers.common["Authorization"] = `Bearer ${AccessToken.get()}`;
    console.log("shipping : ",paramObj)
    if (token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    let headers = {
        "Content-Type": "application/json",
    };
    // Check if paramObj is FormData and adjust headers if necessary
    if (paramObj instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data"; // Set for file uploads
    }
    return instance
        .post(url, paramObj, { headers })
        .then((response) => {
            if (response.hasOwnProperty("status")) {
                return response.data;
            }
            return {
                status: false,
                message:
                    response?.message || "Something went to wrong! Try again later",
            };
        })
        .then((response) => {
            if (response?.success) {
                return response;
            } else {
                return response;
            }
        })
        .catch((error) => {
            return {
                status: false,
                message: "Something went to wrong! Try again later",
            };
        });
}

function update(url, paramObj) {

    instance.defaults.headers.common["Authorization"] = `Bearer ${AccessToken.get()}`;

    return instance
        .put(url, paramObj)
        .then((response) => {
            if (response.hasOwnProperty("status")) {
                switch (response.status) {
                    case 200:
                        return { success: true, data: response.data };
                    case 201:
                        return { success: true, data: response.data };
                    case 401:
                        return { success: false, unauthenticated: true };
                    case 422:
                        return {
                            success: false,
                            data: response.data,
                        };
                    default:
                        return { success: false, message: response };
                }
            }
            return {
                status: false,
                message:
                    response?.message || "Something went to wrong! Try again later",
            };
        })
        .then((response) => {
            if (response?.success) {
                return {
                    ...(response?.data || {}),
                    success: true,
                };
            } else {
                return {
                    ...(response?.data || {}),
                    success: false,
                };
            }
        })
        .catch((error) => {
            const { message } = error;
            return {
                status: false,
                message,
            };
        });
}

function put(url, paramObj, headers = {}) {

    instance.defaults.headers.common["Authorization"] = `Bearer ${AccessToken.get()}`;

    return instance
        .put(url, paramObj)
        .then((response) => {
            if (response.hasOwnProperty("status")) {
                return response.data;
            }
            return {
                status: false,
                message:
                    response?.message || "Something went to wrong! Try again later",
            };
        })
        .then((response) => {
            if (response?.success) {
                return response;
            } else {
                return response;
            }
        })
        .catch((error) => {
            return {
                status: false,
                message: error.message || "Something went to wrong! Try again later",
            };
        });
}

function deleteM(url, paramObj) {
  console.log("API delete called with:", url, paramObj);

  instance.defaults.headers.common["Authorization"] = `Bearer ${AccessToken.get()}`;

  return instance
    .delete(url, {
      data: paramObj,
      responseType: "json",
      validateStatus: false,
    })
    .then((response) => {
      console.log("API delete raw response:", response);
      console.log("API delete response data:", response.data);
      return response.data; // ✅ Keep this as-is
    })
    .catch((error) => {
      console.error("Delete error:", error.response?.data || error.message);
      throw error;
    });
}



function patch(url, paramObj, token) {
    instance.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${AccessToken.get()}`;
    if (token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return instance
        .patch(url, paramObj)
        .then((response) => {
            console.log("Delete API full response:", response);
            return response.data;
            
        })
        .then((response) => {
            if (response.success) {
                return response;
            } else {
                return response;
            }
        })
        .catch((error) => {
            return {
                status: false,
                message: error.message || "Something went to wrong! Try again later",
            };
        });
}

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