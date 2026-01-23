/**
 * Uygulama Konfigürasyon Sabitleri (config.js)
 * 
 * Uygulama genelinde kullanılan sabit değerler.
 * 
 * İçerik:
 * - API endpoint'leri (base URL'ler)
 * - Varsayılan görseller (avatar, post image)
 * - Kategori görselleri mapping'i
 * 
 * Kullanım:
 * - Tüm component ve service'lerde import edilir
 * - Örnek: import { API_BASE_URL, DEFAULT_AVATAR } from "../constants/config";
 */

// API Configuration
export const API_BASE_URL = "http://localhost:3000/api";
export const API_BASE_URL_IMAGES = "http://localhost:3000";

// Default values
export const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=69";
export const DEFAULT_IMAGE = "/coding.png";

// Category Images Mapping
export const CATEGORY_IMAGES = {
  Coding: "/coding.png",
  Technology: "/technology.png",
  Travel: "/travel.png",
  "Web Development": "/web-development.png",
  "Life Style": "/life-style.png",
};

