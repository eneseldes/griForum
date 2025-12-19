/**
 * PostList Component
 * 
 * Post listesi container component'i. Post array'ini alır ve her post için
 * PostCard component'ini render eder.
 */

import "./PostList.scss";
import PostCard from "./PostCard/PostCard.jsx";

function PostList({ posts = [] }) {

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
