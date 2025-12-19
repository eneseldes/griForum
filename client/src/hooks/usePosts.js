/**
 * usePosts Hook
 * 
 * Post listesi yönetimi. Tüm post senaryoları için tek hook:
 * - Tüm postlar
 * - Kategoriye göre filtreleme
 * - Pagination
 * - Sidebar için limitli postlar
 * - Kullanıcının postları (type: 'shared')
 * - Kullanıcının beğendiği postlar (type: 'liked')
 */

import { useEffect, useState } from "react";
import { postService } from "../services/postService";
import { mapPostsFromApi } from "../utils/mappers";

export function usePosts(options = {}) {
  const { 
    category = null, 
    limit = null, 
    pagination = false,
    initialCount = 3,
    type = 'all' // 'all' | 'shared' | 'liked'
  } = options;

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
        let raw;
        if (type === 'shared') {
          raw = await postService.getMyPosts();
        } else if (type === 'liked') {
          raw = await postService.getMyLikedPosts();
        } else {
          raw = await postService.getPosts(category);
        }
        
        if (!isMounted) return;
        
        const posts = mapPostsFromApi(raw);
        setAllPosts(posts);
        
        if (pagination) {
          setDisplayedPosts(posts.slice(0, initialCount));
          setHasMore(posts.length > initialCount);
        } else if (limit) {
          setDisplayedPosts(posts.slice(0, limit));
          setHasMore(false);
        } else {
          setDisplayedPosts(posts);
          setHasMore(false);
        }
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
  }, [category, pagination, initialCount, limit, type]);

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const LOAD_MORE_COUNT = 4;
    const nextCount = displayedPosts.length + LOAD_MORE_COUNT;
    setDisplayedPosts(allPosts.slice(0, nextCount));
    setHasMore(nextCount < allPosts.length);
    setIsLoadingMore(false);
  };

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let raw;
      if (type === 'my') {
        raw = await postService.getMyPosts();
      } else if (type === 'liked') {
        raw = await postService.getMyLikedPosts();
      } else {
        raw = await postService.getPosts(category);
      }
      
      const posts = mapPostsFromApi(raw);
      setAllPosts(posts);
      
      if (pagination) {
        setDisplayedPosts(posts.slice(0, initialCount));
        setHasMore(posts.length > initialCount);
      } else if (limit) {
        setDisplayedPosts(posts.slice(0, limit));
      } else {
        setDisplayedPosts(posts);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    posts: displayedPosts, 
    isLoading, 
    isLoadingMore,
    error, 
    hasMore,
    loadMore,
    refetch
  };
}

export default usePosts;

