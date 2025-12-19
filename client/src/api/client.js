/**
 * API Client
 * 
 * Merkezi API client. Tüm HTTP istekleri için ortak fonksiyonlar sağlar.
 * JWT token yönetimi, header oluşturma, error handling ve response parsing içerir.
 */

import { API_BASE_URL } from "../constants/config";
import { logError } from "../utils/logger";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// JWT token'dan user ID'yi decode eder
export const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    const decoded = JSON.parse(atob(payload));
    return decoded.id || null;
  } catch (error) {
    logError("Error decoding token:", error);
    return null;
  }
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

  if (body !== undefined && body !== null) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, config);
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  let data;
  try {
    if (isJson) {
      const text = await response.text();
      if (!text || text.trim() === "" || text.trim() === "null") {
        data = null;
      } else {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          logError("JSON parse error:", parseError);
          data = { message: "Invalid JSON response", raw: text };
        }
      }
    } else {
      const text = await response.text();
      data = text || null;
    }
  } catch (error) {
    logError("Error reading response:", error);
    data = null;
  }

  if (!response.ok) {
    const errorMessage = 
      (data && typeof data === 'object' && data.message) 
        ? data.message 
        : (data && typeof data === 'string' 
          ? data 
          : `API request failed with status ${response.status}`);
    
    const error = new Error(errorMessage);
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

