/**
 * HomePage Component
 * 
 * Uygulamanın ana sayfası. Landing section, "Write a Story" butonu ve
 * pagination ile post listesi gösterir. usePostsWithPagination hook'u ile
 * post'ları yükler ve "Load More" butonu ile daha fazla post yüklenebilir.
 */

import { useNavigate } from "react-router-dom";
import "./HomePage.scss";
import PostList from "../../components/PostList/PostList.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import { usePostsWithPagination } from "../../features/post";
import { navigateWithAuth } from "../../utils/navigationUtils";

function HomePage() {
  const navigate = useNavigate();
  const { posts, isLoading, isLoadingMore, error, hasMore, loadMore } = usePostsWithPagination();

  return (
    <div className="home-page">
      <div className="landing-page">
        <div className="landing-content">
          <h1>Write,Share and Inspire - Because Every Story Deserves an Audience</h1>
          <p>Read and write amazing stories from people around the world</p>

          <CustomButton 
            label={"Write a Story"} 
            onClick={() => navigateWithAuth(navigate, "/create-post", "/login")}
          />
        </div>
      </div>

      <h1>Recent Posts</h1>

      {isLoading && <p>Loading posts...</p>}
      {error && <p>Could not load posts.</p>}

      {!isLoading && !error && (
        <>
          <PostList posts={posts} />
          {hasMore && (
            <div className="home-page__load-more">
              <CustomButton
                label={isLoadingMore ? "Loading..." : "Load More"}
                onClick={loadMore}
                disabled={isLoadingMore}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
