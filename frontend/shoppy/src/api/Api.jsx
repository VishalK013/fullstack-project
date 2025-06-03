import axios from "axios";
import momentTz from "moment-timezone";

export const AccessToken = {
  get() {
    return window.localStorage.getItem("token");
  },
  set(token) {
    window.localStorage.setItem("token", token);
  },
  remove() {
    window.localStorage.removeItem("token");
  },
};

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const instance = axios.create({
  baseURL,
  timeout: 90000,
  responseType: "json",
  validateStatus: false,
  headers: {
    "Content-Type": "application/json",
    "tz": `${momentTz.tz.guess()}`,
  },
});

function get(url, paramObj = {}, headers = {}, requireAuth = true) {
  if (requireAuth) {
    const token = AccessToken.get();
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
  return instance
    .get(url, { params: paramObj, headers })
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
    .catch((error) => {
      return {
        status: false,
        message: error.message || "Something went wrong! Try again later",
      };
    });
}

function post(url, paramObj, token = null, requireAuth = true) {
  if (requireAuth) {
    const authToken = token || AccessToken.get();
    if (authToken) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
  let headers = {
    "Content-Type": "application/json",
  };
  if (paramObj instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }
  return instance
    .post(url, paramObj, { headers })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      return {
        status: false,
        message: response?.message || "Something went wrong! Try again later",
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: error.message || "Something went wrong! Try again later",
      };
    });
}

function update(url, paramObj, requireAuth = true) {
  if (requireAuth) {
    const token = AccessToken.get();
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
  return instance
    .put(url, paramObj)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      } else if (response.status === 401) {
        return { success: false, unauthenticated: true };
      } else if (response.status === 422) {
        return { success: false, data: response.data };
      }
      return {
        success: false,
        message: response?.message || "Something went wrong! Try again later",
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: error.message || "Something went wrong! Try again later",
      };
    });
}

function put(url, paramObj, headers = {}, requireAuth = true) {
  if (requireAuth) {
    const token = AccessToken.get();
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
  return instance
    .put(url, paramObj, { headers })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      return {
        status: false,
        message: response?.message || "Something went wrong! Try again later",
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: error.message || "Something went wrong! Try again later",
      };
    });
}

function deleteM(url, paramObj, requireAuth = true) {
  if (requireAuth) {
    const token = AccessToken.get();
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
  return instance
    .delete(url, {
      data: paramObj,
      responseType: "json",
      validateStatus: false,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return {
        status: false,
        message: error.message || "Something went wrong! Try again later",
      };
    });
}

function patch(url, paramObj, token = null, requireAuth = true) {
  if (requireAuth) {
    const authToken = token || AccessToken.get();
    if (authToken) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
  return instance
    .patch(url, paramObj)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return {
        status: false,
        message: error.message || "Something went wrong! Try again later",
      };
    });
}

export default {
  instance,
  get,
  post,
  patch,
  update,
  deleteM,
  put,
  baseURL,
};