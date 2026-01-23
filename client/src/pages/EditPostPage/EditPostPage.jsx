/**
 * EditPostPage Component
 * 
 * Mevcut post'u düzenleme sayfası. Başlık, kategori seçimi ve Editor.js ile
 * içerik düzenleme formu içerir. usePostForm hook'u ile post günceller.
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { CATEGORIES_ARRAY } from "../../constants/categories";
import { usePostForm } from "../../hooks/post/usePostForm";
import { usePost } from "../../hooks/post/usePost";
import CustomButton from "../../components/CustomButton/CustomButton";
import Editor from "../CreatePostPage/Editor/Editor";
import "./EditPostPage.scss";

function EditPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { post, isLoading: isLoadingPost } = usePost();
  const { submitPost, isSubmitting } = usePostForm(postId);

  // Post verisi yüklendiğinde form alanlarını doldur
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setCategory(post.category || "");
    }
  }, [post]);

  if (isLoadingPost) {
    return (
      <div className="edit-post-page container">
        <div className="loading-message">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="edit-post-page container">
        <div className="error-message">Post not found</div>
        <CustomButton
          label="Ana Sayfaya Dön"
          onClick={() => navigate("/")}
          variant="success"
          icon={<FaHome />}
        />
      </div>
    );
  }

  return (
    <div className="edit-post-page container">
        <form className="edit-post-form" onSubmit={(e) => { e.preventDefault(); submitPost(title, category, editorRef); }}>
          <div className="page-actions">
            <CustomButton
              label="Ana Sayfaya Dön"
              onClick={() => navigate("/")}
              variant="success"
              icon={<FaHome />}
            />
            <CustomButton
              label={isSubmitting ? "Updating..." : "Update"}
              type="submit"
              variant="default"
              icon={<FaPaperPlane />}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
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
            <Editor ref={editorRef} initialData={post.content} />
          </section>
        </form>
    </div>
  );
}

export default EditPostPage;

