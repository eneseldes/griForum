import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { CATEGORIES_ARRAY } from "../../constants/categories";
import { usePostForm } from "../../hooks/post/usePostForm";
import CustomButton from "../../components/CustomButton/CustomButton";
import Editor from "./Editor/Editor";
import "./CreatePostPage.scss";

function CreatePostPage() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { submitPost, isSubmitting } = usePostForm();

  return (
    <div className="create-post-page container">
        <form className="create-post-form" onSubmit={(e) => { e.preventDefault(); submitPost(title, category, editorRef); }}>
          <div className="page-actions">
            <CustomButton
              label="Ana Sayfaya Dön"
              onClick={() => navigate("/")}
              variant="success"
              icon={<FaHome />}
            />
            <CustomButton
              label={isSubmitting ? "Publishing..." : "Publish"}
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
            <Editor ref={editorRef} />
          </section>
        </form>
    </div>
  );
}

export default CreatePostPage;
