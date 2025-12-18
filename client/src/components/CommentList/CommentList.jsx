import "./CommentList.scss";
import CommentCard from "./CommentCard/CommentCard.jsx";
import CommentForm from "./CommentForm/CommentForm.jsx";

function CommentList({ comments = [], postId, onAddComment, onDeleteComment }) {
  const isLoggedIn = !!localStorage.getItem("token");

  const handleDeleteComment = (commentId) => {
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
  };

  return (
    <div className="comment-list">
      <div className="comment-list__header">
        <h2 className="comment-list__title">Comments</h2>
      </div>
      
      {isLoggedIn ? (
        <CommentForm postId={postId} onAddComment={onAddComment} />
      ) : (
        <div className="comment-list__login-prompt">
          <a href="/login" className="comment-list__login-link">
            Login to write a comment!
          </a>
        </div>
      )}

      <div className="comment-list__items">
        {comments.map((comment) => (
          <CommentCard 
            key={comment.id} 
            comment={comment} 
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentList;
