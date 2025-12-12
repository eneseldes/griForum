import { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

import "./LikeButton.scss";

function LikeButton({hasUserLiked = false, likeCount=0, onLikeToggle}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (onLikeToggle && !loading) {
      setLoading(true);
      try {
        // onLikeToggle async bir fonksiyon olabilir
        const result = onLikeToggle(!hasUserLiked);
        // Eğer Promise döndürüyorsa await et
        if (result && typeof result.then === 'function') {
          await result;
        }
      } catch (error) {
        console.error('Like toggle error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div 
      className={`like-button ${loading ? 'loading' : ''}`} 
      onClick={handleClick}
    >
      <div className="like-button__icons">
        <AiOutlineLike className={`like-button__icons__icon ${!hasUserLiked ? " active-icon" : ""}`} />
        <AiFillLike className={`like-button__icons__icon ${hasUserLiked ? " active-icon" : ""}`} />
        <AiOutlineLike className="like-button__icons__icon like-button__icons__placeholder-icon" />
      </div>
      <div className="like-count">{likeCount}</div>
    </div>
  );
}

export default LikeButton;
