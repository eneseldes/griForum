import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import CustomButton from "../../CustomButton/CustomButton.jsx";
import useCreateComment from "../../../hooks/useCreateComment";
import "./CommentForm.scss";

function CommentForm({ postId, onAddComment }) {
  const [comment, setComment] = useState("");
  const { create, submitting, error, resetError } = useCreateComment(postId);

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!comment.trim()) return;
    try {
      const mapped = await create(comment);
      if (mapped && onAddComment) onAddComment(mapped);
      setComment("");
    } catch (_) {
      // error state handled by hook
    }
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
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            disabled={submitting}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <CustomButton
          onClick={handleSubmit}
          disabled={submitting || !comment.trim()}
          label={
            <>
              <FaPaperPlane /> {submitting ? "Sending..." : "Send Comment"}
            </>
          }
        />
      </form>
    </div>
  );
}

export default CommentForm;
