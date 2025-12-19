/**
 * usePostInteractions Hook
 * 
 * Post için kullanıcı etkileşim state'lerini yöneten hook. Kullanıcının
 * post'u beğenip beğenmediğini, beğeni sayısını ve kullanıcının post sahibi
 * olup olmadığını hesaplar.
 */

import { useState, useEffect } from "react";
import { hasUserLiked as checkUserLiked, isUserOwner, getLikeCount } from "../shared/interactionUtils";

export const usePostInteractions = (post) => {
  const [hasUserLikedState, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isPostOwner, setIsPostOwner] = useState(false);

  useEffect(() => {
    if (post) {
      setHasUserLiked(checkUserLiked(post.likes));
      setLikeCount(getLikeCount(post.likes, post.likesCount));
      setIsPostOwner(isUserOwner(post.authorId));
    }
  }, [post]);

  return {
    isOwner: isPostOwner,
    hasUserLiked: hasUserLikedState,
    likeCount,
    setIsOwner: setIsPostOwner,
    setHasUserLiked,
    setLikeCount,
  };
};

