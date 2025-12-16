import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./CommentForm.scss";

function CommentForm() {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    // TODO: Backend API call here
    console.log("Submitting comment:", comment);
    setComment("");
  };

  return (
    <div className="comment-form">
      <h3 className="comment-form__title">Add A Comment</h3>
      <form onSubmit={handleSubmit} className="comment-form__wrapper">
        <div className="form-group">
          <label htmlFor="comment-textarea" className="form-label">
            Comment
          </label>
          <textarea
            id="comment-textarea"
            className="form-textarea"
            placeholder="Search Anything"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
          />
        </div>
        <button type="submit" className="btn-send">
          <FaPaperPlane /> Send Comment
        </button>
      </form>
    </div>
  );
}

export default CommentForm;
