/**
 * Navigation Utilities
 * 
 * Kullanıcı authentication durumuna göre yönlendirme yapan
 * yardımcı fonksiyonlar.
 */

import { getUserIdFromToken } from "../features/shared";

/**
 * Kullanıcı giriş yapmışsa authenticatedRoute'a, yapmamışsa unauthenticatedRoute'a yönlendirir
 * @param {Function} navigate - React Router navigate fonksiyonu
 * @param {string} authenticatedRoute - Giriş yapmış kullanıcılar için route
 * @param {string} unauthenticatedRoute - Giriş yapmamış kullanıcılar için route (varsayılan: "/login")
 */
export const navigateWithAuth = (navigate, authenticatedRoute, unauthenticatedRoute = "/login") => {
  const userId = getUserIdFromToken();
  if (userId) {
    navigate(authenticatedRoute);
  } else {
    navigate(unauthenticatedRoute);
  }
};

