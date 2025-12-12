import "./CommentList.scss";
import CommentCard from "./CommentCard/CommentCard.jsx";

function CommentList({ comments = [] }) {
  return (
    <div className="comment-list">
      <div className="comment-list__header">
        <h2 className="comment-list__title">Comments</h2>
        <a href="/login" className="comment-list__login-link">
          Login to write a comment!
        </a>
      </div>
      <div className="comment-list__items">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default CommentList;
