/**
 * Post Kategorileri Sabitleri (categories.js)
 * 
 * Post kategorileri için enum ve helper fonksiyonlar.
 * Backend'deki kategori sabitleri ile uyumlu olmalıdır.
 * 
 * İçerik:
 * - POST_CATEGORIES: Kategori enum objesi
 * - CATEGORIES_ARRAY: Kategori array'i
 * - isValidCategory: Kategori doğrulama fonksiyonu
 * 
 * Kullanım:
 * - Post form'larında kategori seçimi için
 * - Kategori filtreleme için
 * - Örnek: import { POST_CATEGORIES, CATEGORIES_ARRAY } from "../constants/categories";
 */

// Post Categories Enum - Must match backend constants
export const POST_CATEGORIES = {
  CODING: "Coding",
  TECHNOLOGY: "Technology",
  LIFESTYLE: "Life Style",
  TRAVEL: "Travel",
  WEB_DEVELOPMENT: "Web Development",
};

// Array of all categories for easy iteration
export const CATEGORIES_ARRAY = Object.values(POST_CATEGORIES);

// Category validation helper
export const isValidCategory = (category) => {
  return CATEGORIES_ARRAY.includes(category);
};

