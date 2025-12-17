import "./HomePage.scss";
import PostList from "../../components/PostList/PostList.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import { usePosts } from "../../hooks/usePosts";

function HomePage() {
  const { posts, loading, error } = usePosts();

  return (
    <div className="home-page">
      <div className="landing-page">
        <div className="landing-content">
          <h1>Write,Share and Inspire - Because Every Story Deserves an Audience</h1>
          <p>Read and write amazing stories from people around the world</p>

          <CustomButton label={"Write a Story"} path={""} />
        </div>
      </div>

      <h1>Recent Posts</h1>

      {loading && <p>Loading posts...</p>}
      {error && <p>Could not load posts.</p>}

      {!loading && !error && <PostList posts={posts} />}
    </div>
  );
}

export default HomePage;
