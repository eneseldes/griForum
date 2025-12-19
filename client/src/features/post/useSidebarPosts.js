/**
 * useSidebarPosts Hook
 * 
 * Sidebar için post'ları fetch eden custom hook. İlk 7 post'u döndürür,
 * opsiyonel olarak kategoriye göre filtreleme yapar.
 */

import { useEffect, useState } from "react";
import { PostService } from "./PostService";
import { mapPostsFromApi } from "./postMapper";

export function useSidebarPosts(category = null) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await PostService.getPosts(category);
        if (!isMounted) return;
        const allPosts = mapPostsFromApi(raw);
        // İlk 7 post'u al
        setPosts(allPosts.slice(0, 7));
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
  }, [category]);

  return { posts, isLoading, error };
}

