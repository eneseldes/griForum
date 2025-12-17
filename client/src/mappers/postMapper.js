const API_BASE_URL = "http://localhost:3000";

const getImageUrl = (images) => {
  if (!Array.isArray(images) || images.length === 0) return "/coding.png";
  const first = images[0];
  // Eğer backend zaten tam URL dönüyorsa direkt kullan
  if (first.startsWith("http://") || first.startsWith("https://")) {
    return first;
  }
  // Backend uploads klasörü altındaysa, server base URL ile birleştir
  if (first.startsWith("/")) {
    return `${API_BASE_URL}${first}`;
  }
  return `${API_BASE_URL}/${first}`;
};

export const mapPostFromApi = (rawPost) => {
  if (!rawPost) return null;

  const createdAt = rawPost.createdAt ? new Date(rawPost.createdAt) : null;

  return {
    id: rawPost._id,
    title: rawPost.title,
    content: rawPost.content,
    category: rawPost.category,
    image: getImageUrl(rawPost.images),
    // UI için kısa özet
    excerpt:
      rawPost.content?.length > 160
        ? `${rawPost.content.slice(0, 157)}...`
        : rawPost.content,
    date: createdAt ? createdAt.toLocaleDateString() : "",
    // Post detail route'u ile eşleşecek şekilde
    link: `/post/${rawPost._id}`,
    authorName: rawPost.author?.username || "Unknown",
    likesCount: Array.isArray(rawPost.likes) ? rawPost.likes.length : 0,
    commentsCount: Array.isArray(rawPost.comments) ? rawPost.comments.length : 0,
    raw: rawPost,
  };
};

export const mapPostsFromApi = (rawPosts) => {
  if (!Array.isArray(rawPosts)) return [];
  return rawPosts.map(mapPostFromApi);
};


