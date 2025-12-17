const API_BASE_URL = "http://localhost:3000/api";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const buildHeaders = (extraHeaders = {}, withAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (withAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

async function request(path, options = {}) {
  const { method = "GET", body, withAuth = false, headers: extraHeaders } = options;

  const config = {
    method,
    headers: buildHeaders(extraHeaders, withAuth),
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, config);
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(
      (data && data.message) || `API request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export default api;
