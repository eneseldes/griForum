/**
 * CreatePostPage Component
 * 
 * Yeni post oluşturma sayfası. Başlık, kategori seçimi ve Editor.js ile
 * içerik oluşturma formu içerir. useCreatePost hook'u ile post oluşturur.
 */

import { useState, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { CATEGORIES_ARRAY } from "../../constants/categories";
import { usePostForm } from "../../hooks/usePostForm";
import Editor from "./Editor/Editor";
import "./CreatePostPage.scss";

function CreatePostPage() {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { submitPost, isSubmitting } = usePostForm();

  return (
    <div className="create-post-page">
      <div className="container">
        <form onSubmit={(e) => { e.preventDefault(); submitPost(title, category, editorRef); }}>
          <div className="page-actions">
            <button
              type="submit"
              className="publish-btn"
              disabled={isSubmitting}
            >
              <FaPaperPlane /> {isSubmitting ? "Publishing..." : "Publish"}
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
            <Editor ref={editorRef} />
          </section>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
