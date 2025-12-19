/**
 * Shared Features Index
 * 
 * Shared feature'ların merkezi export dosyası. API utilities ve
 * interaction utilities'i export eder.
 */

// Shared API utilities
export { api, API_BASE_URL, getUserIdFromToken } from "./api";

// Shared interaction utilities
export { hasUserLiked, isUserOwner, getLikeCount } from "./interactionUtils";

