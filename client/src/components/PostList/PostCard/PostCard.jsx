import "./PostCard.scss";
import { Link } from "react-router-dom";
import { CATEGORY_IMAGES, DEFAULT_IMAGE } from "../../../constants/config";

const truncateExcerpt = (text, maxWords = 20) => {
  if (!text) return "";
  
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  
  return words.slice(0, maxWords).join(" ") + "...";
};

function PostCard({ post = {} }) {
  const categoryImage = CATEGORY_IMAGES[post.category] || DEFAULT_IMAGE;
  const truncatedExcerpt = truncateExcerpt(post.excerpt, 25);

  return (
    <>
      <Link to={post.link} className="post-card">
        <div className="post-card__image">
          <img src={categoryImage} alt={post.title} />
        </div>
        <div className="post-card__content">
          <div className="post-card__content__info">
            <p className="post-card__content__info__category">{post.category}</p>
            <h2 className="post-card__content__info__title">{post.title}</h2>
            <p className="post-card__content__info__excerpt">{truncatedExcerpt}</p>
          </div>
        </div>
      </Link>
    </>
  );
}

export default PostCard;
