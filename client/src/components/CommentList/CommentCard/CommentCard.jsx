import { useState, useEffect } from "react";
import "./CommentCard.scss";
import "../../LikeButton/LikeButton.jsx";
import LikeButton from "../../LikeButton/LikeButton.jsx";
import CustomButton from "../../CustomButton/CustomButton.jsx";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog.jsx";
import { FaTrash } from "react-icons/fa";
import { getUserIdFromToken } from "../../../services/api";
import { CommentService } from "../../../services/CommentService";

function CommentCard({ comment = {}, onDelete }) {
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCommentOwner, setIsCommentOwner] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (comment) {
      const userId = getUserIdFromToken();
      const isLiked = userId && Array.isArray(comment.likes) && comment.likes.some(
        (likeId) => likeId.toString() === userId
      );
      setHasUserLiked(isLiked || false);
      setLikeCount(comment.likesCount || (Array.isArray(comment.likes) ? comment.likes.length : 0));
      
      // Comment sahibi kontrolü
      const ownerCheck = userId && comment.authorId && (
        comment.authorId.toString() === userId.toString() ||
        (comment.raw?.author && comment.raw.author.toString() === userId.toString())
      );
      setIsCommentOwner(ownerCheck || false);
    }
  }, [comment]);

  const handleDeleteComment = async () => {
    try {
      await CommentService.deleteComment(comment.id);
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.status === 401) {
        alert("You need to login to delete comments.");
      } else {
        alert(error.data?.message || "Failed to delete comment. Please try again.");
      }
    }
  };

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
      <div className="comment-card__actions">
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
        {isCommentOwner && (
          <CustomButton
            label="Delete"
            onClick={() => setShowDeleteDialog(true)}
            variant="danger"
            icon={<FaTrash />}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

export default CommentCard;
