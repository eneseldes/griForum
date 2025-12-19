/**
 * PostCard Component
 * 
 * Tek bir post'u kart formatında gösteren component. Post başlığı, kategori,
 * özet, görsel ve "Read more" linkini içerir.
 */

import "./PostCard.scss";
import { Link } from "react-router-dom";
import { CATEGORY_IMAGES, DEFAULT_IMAGE } from "../../../constants/config";

function PostCard({ post = {} }) {
  const categoryImage = CATEGORY_IMAGES[post.category] || DEFAULT_IMAGE;

  return (
    <>
      <div className="post-card">
        <div className="post-card__image">
          <img src={categoryImage} alt={post.title} />
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
