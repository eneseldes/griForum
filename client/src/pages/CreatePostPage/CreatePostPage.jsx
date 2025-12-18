import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { PostService } from "../../services/PostService";
import { CATEGORIES_ARRAY } from "../../constants/categories";
import Editor from "./Editor/Editor";
import "./CreatePostPage.scss";

function CreatePostPage() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    if (!editorRef.current) {
      alert("Editor is not ready");
      return;
    }

    setLoading(true);

    try {
      // Editor.js'den content'i al (Editor.js dokümantasyonuna göre)
      const outputData = await editorRef.current.save();
      
      if (!outputData || !outputData.blocks || outputData.blocks.length === 0) {
        alert("Please enter some content");
        setLoading(false);
        return;
      }

      // Editor.js output'unu JSON string olarak kaydet
      // Bu şekilde tüm block data'sı korunur ve PostDetailPage'de düzgün render edilebilir
      const content = JSON.stringify(outputData);

      // Post oluştur
      const response = await PostService.createPost({
        title: title.trim(),
        content: content,
        category: category,
      });

      if (response) {
        // Başarılı - post detail sayfasına yönlendir
        const postId = response.post?._id || response.post?.id || response._id || response.id;
        if (postId) {
          navigate(`/post/${postId}`);
        } else {
          // Post ID bulunamadı, ana sayfaya yönlendir
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.status === 401) {
        navigate("/login");
      } else {
        alert(error.data?.message || "Failed to create post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="page-actions">
            <button
              type="submit"
              className="publish-btn"
              disabled={loading}
            >
              <FaPaperPlane /> {loading ? "Publishing..." : "Publish"}
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
