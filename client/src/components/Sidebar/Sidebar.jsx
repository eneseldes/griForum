import "./Sidebar.scss";
import SidebarItem from "./SidebarItem/SidebarItem.jsx";
import { CATEGORIES_ARRAY } from "../../constants/categories.js";

function Sidebar({ posts = [] }) {
  return (
    <div className="sidebar">
      <div className="subtitle">Most Popular</div>
      <div className="sidebar__list">
        {posts.map((post) => (
          <SidebarItem key={post.id} post={post} />
        ))}
      </div>
      <div className="subtitle">Categories</div>
      <div className="sidebar__categories">
        {CATEGORIES_ARRAY.map((category) => (
          <div 
            key={category} 
            className={`sidebar__categories__item sidebar__categories__item--${category.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {category.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
