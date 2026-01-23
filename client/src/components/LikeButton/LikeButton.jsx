import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useAuth } from "../../contexts/useAuth";
import { handleApiError } from "../../utils/errorHandler";
import { logError } from "../../utils/logger";
import { useLikePost } from "../../hooks/post/useLikePost";
import { useLikeComment } from "../../hooks/comment/useLikeComment";

import "./LikeButton.scss";

function LikeButton({
  hasUserLiked = false,
  likeCount = 0,
  type, // "post" or "comment"
  id, // postId or commentId
  onLikeChange, // callback function: (newLikedState, newLikeCount) => void
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { likePost } = useLikePost();
  const { likeComment } = useLikeComment();
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
      if (type === "post") {
        const response = await likePost(id);
        // Backend response: { liked, likeCount }
        if (
          response &&
          response.liked !== undefined &&
          typeof response.likeCount === "number"
        ) {
          setLiked(response.liked);
          setCount(response.likeCount);
          if (onLikeChange) {
            onLikeChange(response.liked, response.likeCount);
          }
        } else {
          setLiked(previousLiked);
          setCount(previousCount);
          logError("Invalid response from likePost hook:", response);
        }
      } else if (type === "comment") {
        const response = await likeComment(id);
        if (response && typeof response.likeCount === "number") {
          const userId = user?._id;
          // liked bilgisi backend yerine userId + likes üzerinden hesaplanır
          // likeComment hook'u sadece count döndürdüğü için optimistic state'i koruyoruz
          const isLiked = !previousLiked;
          setLiked(isLiked);
          setCount(response.likeCount);
          if (onLikeChange) {
            onLikeChange(isLiked, response.likeCount);
          }
        } else {
          setLiked(previousLiked);
          setCount(previousCount);
          logError("Invalid response from likeComment hook:", response);
        }
      }
    } catch (error) {
      // Hata durumunda optimistic update'i geri al
      setLiked(previousLiked);
      setCount(previousCount);
      
      // 401 hatası durumunda login sayfasına yönlendir (handleApiError içinde yapılıyor)
      if (error.status === 401) {
        navigate("/login");
      } else {
        handleApiError(error, navigate, "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`like-button ${loading ? "loading" : ""} ${loading ? "disabled" : ""}`}
      onClick={handleClick}
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
