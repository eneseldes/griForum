import { useNavigate } from "react-router-dom";
import "./HomePage.scss";
import PostList from "../../components/PostList/PostList.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import { usePosts } from "../../hooks/post/usePosts";

function HomePage() {
  const navigate = useNavigate();
  const { posts, isLoading, isLoadingMore, error, hasMore, loadMore } =
    usePosts({ pagination: true });

  return (
    <div className="home-page">
      <div className="landing-page section">
        <div className="landing-page__title">
          Write,Share and Inspire - Because Every Story Deserves an Audience
        </div>
        <p>Read and write amazing stories from people around the world</p>

        <CustomButton
          label={"Write a Story"}
          onClick={() => navigate("/create-post")}
        />
      </div>

      {isLoading && <p>Loading posts...</p>}
      {error && <p>Could not load posts.</p>}

      {!isLoading && !error && (
        <div className="home-page__posts section">
          <div className="title">Recent Posts</div>
          <PostList posts={posts} />
          {hasMore && (
            <CustomButton
            className="home-page__posts__load-more"
              label={isLoadingMore ? "Loading..." : "Load More"}
              onClick={loadMore}
              disabled={isLoadingMore}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
