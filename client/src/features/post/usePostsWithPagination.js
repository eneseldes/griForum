/**
 * usePostsWithPagination Hook
 * 
 * Pagination ile post'ları fetch eden custom hook. İlk 3 post'u yükler,
 * sonra "Load More" butonu ile her seferinde 4 post daha yükler.
 */

import { useEffect, useState } from "react";
import { PostService } from "./PostService";
import { mapPostsFromApi } from "./postMapper";

const INITIAL_POSTS_COUNT = 3;
const LOAD_MORE_COUNT = 4;

export function usePostsWithPagination() {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await PostService.getPosts();
        if (!isMounted) return;
        const posts = mapPostsFromApi(raw);
        setAllPosts(posts);
        // İlk 3 post'u göster
        setDisplayedPosts(posts.slice(0, INITIAL_POSTS_COUNT));
        setHasMore(posts.length > INITIAL_POSTS_COUNT);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Mevcut gösterilen post sayısına 4 ekle
    const nextCount = displayedPosts.length + LOAD_MORE_COUNT;
    setDisplayedPosts(allPosts.slice(0, nextCount));
    setHasMore(nextCount < allPosts.length);
    setIsLoadingMore(false);
  };

  return { 
    posts: displayedPosts, 
    isLoading, 
    isLoadingMore,
    error, 
    hasMore,
    loadMore 
  };
}

