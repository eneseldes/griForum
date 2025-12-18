import "./PostCard.scss";
import { Link } from "react-router-dom";

const CATEGORY_IMAGES = {
  Coding: "/coding.png",
  Technology: "/tekno.png",
  Travel: "/travel.png",
  "Web Development": "/coding.png",
  "Life Style": "/travel.png",

};


function PostCard({ post = {} }) {
  const categoryImage = CATEGORY_IMAGES[post.category];

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
