/**
 * Merkezi API client. Axios kullanarak tüm HTTP isteklerini yönetir.
 * JWT token yönetimi, header oluşturma, error handling otomatik olarak yapılır.
 * 
 * Fonksiyonlar:
 * - api.get: GET isteği
 * - api.post: POST isteği
 * - api.put: PUT isteği
 * - api.patch: PATCH isteği
 * - api.delete: DELETE isteği
 * 
 * Kullanım:
 * - Tüm service dosyalarında kullanılır
 * - Direkt component'lerde kullanılmaz, service'ler üzerinden erişilir
 */

import axios from "axios";
import { API_BASE_URL } from "../constants/config";
import { logError } from "../utils/logger";

// LocalStorage'dan JWT token'ı okur
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Base URL ayarlanır
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Her istekten önce çalışır. withAuth flag'i true ise token'ı header'a ekler.
axiosInstance.interceptors.request.use(
  (config) => {
    // withAuth flag'i varsa ve true ise token ekle
    if (config.withAuth) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // withAuth flag'ini config'den kaldır (axios'a gönderilmemeli)
    delete config.withAuth;
    
    // null body'yi undefined'a çevir (axios bunu atlar ve serialization hatası önlenir)
    if (config.data === null) {
      config.data = undefined;
    }
    
    // Content-Type header'ını sadece body olan istekler için ekle
    // GET ve DELETE istekleri için body olmadığından Content-Type eklenmez
    const methodsWithBody = ['post', 'put', 'patch'];
    const hasBody = config.data !== undefined;
    
    if (methodsWithBody.includes(config.method?.toLowerCase()) && hasBody) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Her response'dan sonra çalışır. Hata durumlarını handle eder.
axiosInstance.interceptors.response.use(
  (response) => {
    // Başarılı response'u direkt döndür
    return response.data;
  },
  (error) => {
    // Axios error objesi
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";

    // Hata objesini standartlaştır
    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    customError.data = error.response?.data;

    logError("API Error:", customError);
    throw customError;
  }
);

// Frontendde yapılacak HTTP method'ları için kısayol fonksiyonlar sağlar
export const api = {
  get: (path, options = {}) => {
    return axiosInstance.get(path, options);
  },
  post: (path, body, options = {}) => {
    return axiosInstance.post(path, body, options);
  },
  put: (path, body, options = {}) => {
    return axiosInstance.put(path, body, options);
  },
  patch: (path, body, options = {}) => {
    return axiosInstance.patch(path, body, options);
  },
  delete: (path, options = {}) => {
    return axiosInstance.delete(path, options);
  },
};

export default api;
