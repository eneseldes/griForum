import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { PostService } from "../../services/PostService";
import { CATEGORIES_ARRAY } from "../../constants/categories";
import { mapPostFromApi } from "../../mappers/postMapper";
import Editor from "../CreatePostPage/Editor/Editor";
import "./EditPostPage.scss";

function EditPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialContent, setInitialContent] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Post verilerini yükle
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        navigate("/");
        return;
      }

      try {
        setFetching(true);
        const rawPost = await PostService.getPostById(postId);
        const post = mapPostFromApi(rawPost);

        if (!post) {
          navigate("/");
          return;
        }

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
            console.error("Error parsing content:", error);
          }
        }
        setInitialContent(contentData);
      } catch (error) {
        console.error("Error fetching post:", error);
        if (error.status === 404) {
          navigate("/");
        } else {
          alert("Failed to load post. Please try again.");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

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
      // Editor.js'den content'i al
      const outputData = await editorRef.current.save();
      
      if (!outputData || !outputData.blocks || outputData.blocks.length === 0) {
        alert("Please enter some content");
        setLoading(false);
        return;
      }

      // Editor.js output'unu JSON string olarak kaydet
      const content = JSON.stringify(outputData);

      // Post güncelle
      const response = await PostService.updatePost(postId, {
        title: title.trim(),
        content: content,
        category: category,
      });

      if (response) {
        // Başarılı - post detail sayfasına yönlendir
        navigate(`/post/${postId}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.status === 401) {
        navigate("/login");
      } else {
        alert(error.data?.message || "Failed to update post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="edit-post-page"><div className="container"><p>Loading post...</p></div></div>;
  }

  return (
    <div className="edit-post-page">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="page-actions">
            <button
              type="submit"
              className="publish-btn"
              disabled={loading}
            >
              <FaPaperPlane /> {loading ? "Updating..." : "Update"}
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

