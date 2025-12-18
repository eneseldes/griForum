import "./CommentCard.scss";
import "../../LikeButton/LikeButton.jsx";
import LikeButton from "../../LikeButton/LikeButton.jsx";

function CommentCard({ comment = {} }) {
  return (
    <div className="comment-card">
      <div className="comment-card__avatar">
        <img src="https://i.pravatar.cc/150?img=2" alt={comment.username} />
      </div>
      <div className="comment-card__meta">
        <h4 className="comment-card__username">{comment.username}</h4>
        <span className="comment-card__date">{comment.date}</span>
      </div>
      <p className="comment-card__text">{comment.text}</p>
      <LikeButton likes={comment.likes} />
      </div>
  );
}

export default CommentCard;
