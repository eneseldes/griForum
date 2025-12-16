// Post Categories Enum
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

