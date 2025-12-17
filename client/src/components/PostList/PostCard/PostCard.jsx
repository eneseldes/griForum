import "./PostCard.scss";
import { Link } from "react-router-dom";

function PostCard({ post = {} }) {
  return (
    <>
      <div className="post-card">
        <div className="post-card__image">
          <img src={post.image} alt={post.title} />
        </div>
        <div className="post-card__info">
          <p className="post-card__info__category">{post.category}</p>
          <h2 className="title--small">{post.title}</h2>
          <p className="post-card__info__excerpt">{post.excerpt}</p>
          <p className="post-card__info__link">
            <Link to={post.link}>Read more</Link>
          </p>
        </div>
        <div className="post-date">{post.date}</div>
      </div>
    </>
  );
}

export default PostCard;
