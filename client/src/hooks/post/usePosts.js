/**
 * Post listesi yönetimi. Tüm post senaryoları için tek hook.
 *
 * Senaryolar:
 * - Tüm postlar (type: 'all')
 * - Kategoriye göre filtreleme (category parametresi)
 * - Pagination (pagination: true)
 * - Sidebar için limitli postlar (limit parametresi)
 * - Kullanıcının postları (type: 'shared')
 * - Kullanıcının beğendiği postlar (type: 'liked')
 *
 * Döndürdüğü Değerler:
 * - posts: Post array'i (gösterilecek postlar)
 * - isLoading: Yükleniyor mu? (boolean)
 * - isLoadingMore: Daha fazla yükleniyor mu? (boolean)
 * - error: Hata objesi (varsa)
 * - hasMore: Daha fazla post var mı? (boolean, pagination için)
 * - loadMore: Daha fazla post yükleme fonksiyonu
 * - refetch: Post listesini yeniden yükleme fonksiyonu
 *
 * Kullanım:
 * - HomePage, PostList component'lerinde
 * - Örnek: const { posts, isLoading } = usePosts({ category: "Coding" });
 */

import { useEffect, useState } from "react";
import { postService } from "../../services/postService";

export function usePosts(options = {}) {
  const {
    category = null,
    limit = null,
    pagination = false,
    initialCount = 4,
    type = "all", // 'all' | 'shared' | 'liked'
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
        let posts;
        if (type === "shared") {
          posts = await postService.getMyPosts();
        } else if (type === "liked") {
          posts = await postService.getMyLikedPosts();
        } else {
          posts = await postService.getPosts(category);
        }

        if (!isMounted) return;

        // Service'ler zaten mapped data döndürüyor
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
      let posts;
      if (type === "my") {
        posts = await postService.getMyPosts();
      } else if (type === "liked") {
        posts = await postService.getMyLikedPosts();
      } else {
        posts = await postService.getPosts(category);
      }

      // Service'ler zaten mapped data döndürüyor
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
    refetch,
  };
}

export default usePosts;


