import { useState, useEffect } from "react";
import "./CommentCard.scss";
import "../../LikeButton/LikeButton.jsx";
import LikeButton from "../../LikeButton/LikeButton.jsx";
import CustomButton from "../../CustomButton/CustomButton.jsx";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog.jsx";
import { FaTrash } from "react-icons/fa";
import { hasUserLiked as checkUserLiked, isUserOwner, getLikeCount } from "../../../utils/helpers";
import { DEFAULT_AVATAR } from "../../../constants/config";
import { useAuth } from "../../../contexts/useAuth";
import { useDeleteComment } from "../../../hooks/comment/useDeleteComment";

function CommentCard({ comment = {}, onDelete }) {
  const { user } = useAuth();
  const { deleteComment, isDeleting } = useDeleteComment();
  const [hasUserLikedState, setHasUserLiked] = useState(false);
  const [likeCountState, setLikeCount] = useState(0);
  const [isCommentOwner, setIsCommentOwner] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (comment) {
      const userId = user?._id;
      setHasUserLiked(checkUserLiked(comment.likes, userId));
      setLikeCount(getLikeCount(comment.likes, comment.likesCount));
      setIsCommentOwner(isUserOwner(comment.authorId, userId));
    }
  }, [comment, user]);

  const handleDeleteComment = async () => {
    const success = await deleteComment(comment.id);
    if (success && onDelete) {
      onDelete(comment.id);
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
            disabled={isDeleting}
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
