/**
 * Genel amaçlı yardımcı fonksiyonlar.
 * Interaction utilities (beğeni, sahiplik kontrolü) ve form validation fonksiyonları.
 * 
 * Fonksiyonlar:
 * - hasUserLiked: Kullanıcının bir öğeyi beğenip beğenmediğini kontrol eder
 * - isUserOwner: Kullanıcının bir öğenin sahibi olup olmadığını kontrol eder
 * - getLikeCount: Beğeni sayısını hesaplar
 * - validatePost: Post form validasyonu yapar
 * - extractEditorContent: Editor.js içeriğini çıkarır
 */

export const hasUserLiked = (likes, userId) => {
  if (!userId || !Array.isArray(likes)) return false;
  return likes.some((likeId) => likeId.toString() === userId.toString());
};

export const isUserOwner = (authorId, userId) => {
  if (!userId || !authorId) return false;
  return authorId.toString() === userId.toString();
};

export const getLikeCount = (likes, likesCount) => {
  if (typeof likesCount === "number") return likesCount;
  return Array.isArray(likes) ? likes.length : 0;
};

export const validatePost = (title, category, editorRef, showError) => {
  if (!title.trim()) {
    showError("Please enter a title");
    return false;
  }

  if (!category) {
    showError("Please select a category");
    return false;
  }

  if (!editorRef.current) {
    showError("Editor is not ready");
    return false;
  }

  return true;
};

export const extractEditorContent = async (editorRef, showError) => {
  const outputData = await editorRef.current.save();
  
  if (!outputData || !outputData.blocks || outputData.blocks.length === 0) {
    showError("Please enter some content");
    return null;
  }

  return JSON.stringify(outputData);
};

