/**
 * Tüm API endpoint'lerinin merkezi tanımları.
 * Endpoint'ler burada toplanarak değişikliklerin tek yerden yönetilmesi sağlanır.
 * 
 * Yapı:
 * - endpoints.auth: Authentication endpoint'leri
 * - endpoints.posts: Post endpoint'leri
 * - endpoints.comments: Yorum endpoint'leri
 * - endpoints.users: Kullanıcı endpoint'leri
 * - endpoints.admin: Admin endpoint'leri
 */

export const endpoints = {
  // Auth endpoints
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },

  // Post endpoints
  posts: {
    list: "/posts",
    detail: (id) => `/posts/${id}`,
    create: "/posts",
    update: (id) => `/posts/${id}`,
    delete: (id) => `/posts/${id}`,
    like: (id) => `/posts/${id}/like`,
    myPosts: "/posts/my-posts",
    myLikedPosts: "/posts/my-liked-posts",
  },

  // Comment endpoints
  comments: {
    list: (postId) => `/comments/${postId}`,
    create: (postId) => `/comments/${postId}`,
    update: (id) => `/comments/${id}`,
    delete: (id) => `/comments/${id}`,
    like: (id) => `/comments/${id}/like`,
  },

  // User endpoints
  users: {
    me: "/users/me",
    update: "/users/update",
  },

  // Admin endpoints, inşallah bir gün ekleyeceğiz
  admin: {
    
  },
};
