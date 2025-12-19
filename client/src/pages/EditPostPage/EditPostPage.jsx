/**
 * EditPostPage Component
 * 
 * Mevcut post'u düzenleme sayfası. Post verilerini yükler, form'a doldurur
 * ve useUpdatePost hook'u ile güncelleme yapar. Editor.js'e initialData prop'u ile
 * mevcut içeriği yükler.
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { CATEGORIES_ARRAY } from "../../constants/categories";
import { usePost } from "../../hooks/usePost";
import { usePostForm } from "../../hooks/usePostForm";
import { handleApiError } from "../../utils/errorHandler";
import { logError } from "../../utils/logger";
import Editor from "../CreatePostPage/Editor/Editor";
import "./EditPostPage.scss";

function EditPostPage() {
  const navigate = useNavigate();
  const { post, isLoading, error, postId } = usePost();
  const { submitPost, isSubmitting } = usePostForm(postId);
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [initialContent, setInitialContent] = useState(null);

  // Post verilerini form'a yükle
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      
      // Content'i parse et
      let contentData = null;
      if (post.content) {
        try {
          contentData = typeof post.content === "string" 
            ? JSON.parse(post.content) 
            : post.content;
        } catch (error) {
          logError("Error parsing content:", error);
        }
      }
      setInitialContent(contentData);
    } else if (error) {
      handleApiError(error, navigate, "Failed to load post. Please try again.");
      if (error.status === 404) {
        navigate("/");
      }
    }
  }, [post, error, navigate]);

  if (isLoading && !post) {
    return <div className="edit-post-page"><div className="container"><p>Loading post...</p></div></div>;
  }

  if (error && !post) {
    return <div className="edit-post-page"><div className="container"><p>Could not load post.</p></div></div>;
  }

  return (
    <div className="edit-post-page">
      <div className="container">
        <form onSubmit={(e) => { e.preventDefault(); submitPost(title, category, editorRef); }}>
          <div className="page-actions">
            <button
              type="submit"
              className="publish-btn"
              disabled={isSubmitting}
            >
              <FaPaperPlane /> {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>

          <div className="title-wrap">
            <input
              type="text"
              className="title-input"
              placeholder="Title"
              aria-label="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="category-wrap">
            <select
              className="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES_ARRAY.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <section className="editor-section">
            <Editor ref={editorRef} initialData={initialContent} />
          </section>
        </form>
      </div>
    </div>
  );
}

export default EditPostPage;

