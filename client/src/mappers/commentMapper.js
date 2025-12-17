export const mapCommentFromApi = (rawComment) => {
  if (!rawComment) return null;

  const createdAt = rawComment.createdAt ? new Date(rawComment.createdAt) : null;

  return {
    id: rawComment._id,
    text: rawComment.text,
    username: rawComment.author?.username || "Unknown",
    avatar:
      rawComment.author?.profilePicture ||
      rawComment.author?.avatar ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    date: createdAt ? createdAt.toLocaleDateString() : "",
    raw: rawComment,
  };
};

export const mapCommentsFromApi = (rawComments) => {
  if (!Array.isArray(rawComments)) return [];
  return rawComments.map(mapCommentFromApi);
};


