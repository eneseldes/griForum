import { useState, useEffect } from "react";
import "./CommentCard.scss";
import "../../LikeButton/LikeButton.jsx";
import LikeButton from "../../LikeButton/LikeButton.jsx";
import { getUserIdFromToken } from "../../../services/api";

function CommentCard({ comment = {} }) {
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (comment) {
      const userId = getUserIdFromToken();
      const isLiked = userId && Array.isArray(comment.likes) && comment.likes.some(
        (likeId) => likeId.toString() === userId
      );
      setHasUserLiked(isLiked || false);
      setLikeCount(comment.likesCount || (Array.isArray(comment.likes) ? comment.likes.length : 0));
    }
  }, [comment]);

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
      <LikeButton
        type="comment"
        id={comment.id}
        hasUserLiked={hasUserLiked}
        likeCount={likeCount}
        onLikeChange={(newLiked, newCount) => {
          setHasUserLiked(newLiked);
          setLikeCount(newCount);
        }}
      />
    </div>
  );
}

export default CommentCard;
