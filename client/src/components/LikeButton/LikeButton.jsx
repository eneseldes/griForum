import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { PostService } from "../../services/PostService";
import { CommentService } from "../../services/CommentService";
import { getUserIdFromToken } from "../../services/api";

import "./LikeButton.scss";

function LikeButton({
  hasUserLiked = false,
  likeCount = 0,
  type, // "post" or "comment"
  id, // postId or commentId
  onLikeChange, // callback function: (newLikedState, newLikeCount) => void
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(hasUserLiked);
  const [count, setCount] = useState(likeCount);

  // Prop'lar değiştiğinde state'i güncelle
  useEffect(() => {
    setLiked(hasUserLiked);
    setCount(likeCount);
  }, [hasUserLiked, likeCount]);

  const handleClick = async () => {
    if (loading || !type || !id) return;

    // Optimistic update - UI'ı hemen güncelle
    const previousLiked = liked;
    const previousCount = count;
    const newLikedState = !liked;
    const newCount = newLikedState ? count + 1 : count - 1;
    setLiked(newLikedState);
    setCount(newCount);

    setLoading(true);

    try {
      let response;
      if (type === "post") {
        response = await PostService.likePost(id);
        // Backend response: { liked: boolean, likeCount: number }
        if (response && response.liked !== undefined && typeof response.likeCount === "number") {
          setLiked(response.liked);
          setCount(response.likeCount);
          if (onLikeChange) {
            onLikeChange(response.liked, response.likeCount);
          }
        } else {
          // Geçersiz response - optimistic update'i geri al
          setLiked(previousLiked);
          setCount(previousCount);
          console.error("Invalid response from likePost:", response);
        }
      } else if (type === "comment") {
        response = await CommentService.likeComment(id);
        // Backend response: comment object with likes array
        if (response && Array.isArray(response.likes)) {
          const userId = getUserIdFromToken();
          const isLiked = userId && response.likes.some(
            (likeId) => likeId.toString() === userId.toString()
          );
          setLiked(isLiked);
          setCount(response.likes.length);
          if (onLikeChange) {
            onLikeChange(isLiked, response.likes.length);
          }
        } else {
          // Geçersiz response - optimistic update'i geri al
          setLiked(previousLiked);
          setCount(previousCount);
          console.error("Invalid response from likeComment:", response);
        }
      }
    } catch (error) {
      // Hata durumunda optimistic update'i geri al
      setLiked(previousLiked);
      setCount(previousCount);
      console.error("Error liking:", error);
      
      // 401 hatası durumunda login sayfasına yönlendir
      if (error.status === 401) {
        navigate("/login");
      } else if (error.status === 500) {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`like-button ${loading ? "loading" : ""} ${loading ? "disabled" : ""}`}
      onClick={handleClick}
      style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
    >
      <div className="like-button__icons">
        <AiOutlineLike
          className={`like-button__icons__icon ${!liked ? " active-icon" : ""}`}
        />
        <AiFillLike
          className={`like-button__icons__icon ${liked ? " active-icon" : ""}`}
        />
        <AiOutlineLike className="like-button__icons__icon like-button__icons__placeholder-icon" />
      </div>
      <div className="like-count">{count}</div>
    </div>
  );
}

export default LikeButton;
