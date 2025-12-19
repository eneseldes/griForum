/**
 * CommentCard Component
 * 
 * Tek bir yorumu gösteren component. Yorum içeriği, yazar bilgisi, avatar, beğeni butonu
 * ve sahip kullanıcı için silme butonu içerir.
 */

import { useState, useEffect } from "react";
import "./CommentCard.scss";
import "../../LikeButton/LikeButton.jsx";
import LikeButton from "../../LikeButton/LikeButton.jsx";
import CustomButton from "../../CustomButton/CustomButton.jsx";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog.jsx";
import { FaTrash } from "react-icons/fa";
import { commentService } from "../../../services/commentService";
import { hasUserLiked as checkUserLiked, isUserOwner, getLikeCount } from "../../../utils/helpers";
import { handleApiError } from "../../../utils/errorHandler";
import { showSuccess } from "../../../utils/toast";
import { DEFAULT_AVATAR } from "../../../constants/config";
import { useNavigate } from "react-router-dom";

function CommentCard({ comment = {}, onDelete }) {
  const navigate = useNavigate();
  const [hasUserLikedState, setHasUserLiked] = useState(false);
  const [likeCountState, setLikeCount] = useState(0);
  const [isCommentOwner, setIsCommentOwner] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (comment) {
      setHasUserLiked(checkUserLiked(comment.likes));
      setLikeCount(getLikeCount(comment.likes, comment.likesCount));
      setIsCommentOwner(isUserOwner(comment.authorId));
    }
  }, [comment]);

  const handleDeleteComment = async () => {
    try {
      await commentService.deleteComment(comment.id);
      showSuccess("Yorum başarıyla silindi!");
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      handleApiError(error, navigate, "Failed to delete comment. Please try again.");
    }
  };

  return (
    <div className="comment-card">
      <div className="comment-card__avatar">
        <img src={comment.avatar || DEFAULT_AVATAR} alt={comment.username} />
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
          hasUserLiked={hasUserLikedState}
          likeCount={likeCountState}
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
