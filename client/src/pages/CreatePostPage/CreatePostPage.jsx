import { FaPaperPlane, FaImage, FaPalette, FaCode, FaAlignLeft, FaLink } from "react-icons/fa";
import "./CreatePostPage.scss";

function CreatePostPage() {
  return (
    <div className="create-post-page">
      <div className="container">
        <div className="page-actions">
          <button type="button" className="btn btn-primary">
            <FaPaperPlane />
            Publish
          </button>
        </div>

        <div className="title-wrap">
          <input
            type="text"
            className="title-input"
            placeholder="Title"
            aria-label="Post title"
          />
        </div>

        <section className="editor">
          <div className="editor__toolbar" aria-label="Editor toolbar">
            <button type="button" className="toolbar-btn"><FaImage /> Image</button>
            <button type="button" className="toolbar-btn"><FaPalette /> Color</button>
            <button type="button" className="toolbar-btn"><FaCode /> Text</button>
            <button type="button" className="toolbar-btn"><FaAlignLeft /> Align</button>
            <button type="button" className="toolbar-btn"><FaLink /> Link</button>
          </div>

          <div className="editor__body">
            <textarea
              className="editor__textarea"
              placeholder="Type ..."
              rows={10}
              aria-label="Post content"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default CreatePostPage;
