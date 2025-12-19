/**
 * useCommentInteractions Hook
 * 
 * Comment için kullanıcı etkileşim state'lerini yöneten hook. Kullanıcının
 * comment'i beğenip beğenmediğini, beğeni sayısını ve kullanıcının comment sahibi
 * olup olmadığını hesaplar.
 */

import { useState, useEffect } from "react";
import { hasUserLiked as checkUserLiked, isUserOwner, getLikeCount } from "../shared/interactionUtils";

export const useCommentInteractions = (comment) => {
  const [hasUserLikedState, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCommentOwner, setIsCommentOwner] = useState(false);

  useEffect(() => {
    if (comment) {
      setHasUserLiked(checkUserLiked(comment.likes));
      setLikeCount(getLikeCount(comment.likes, comment.likesCount));
      setIsCommentOwner(isUserOwner(comment.authorId));
    }
  }, [comment]);

  return {
    isOwner: isCommentOwner,
    hasUserLiked: hasUserLikedState,
    likeCount,
    setIsOwner: setIsCommentOwner,
    setHasUserLiked,
    setLikeCount,
  };
};

