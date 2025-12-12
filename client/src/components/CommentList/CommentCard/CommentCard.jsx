import "./CommentCard.scss";

function CommentCard({ comment = {} }) {
  return (
    <div className="comment-card">
      <div className="comment-card__avatar">
        <img src={comment.avatar} alt={comment.username} />
      </div>
      <div className="comment-card__meta">
        <h4 className="comment-card__username">{comment.username}</h4>
        <span className="comment-card__date">{comment.date}</span>
      </div>
      <p className="comment-card__text">{comment.text}</p>
    </div>
  );
}

export default CommentCard;
