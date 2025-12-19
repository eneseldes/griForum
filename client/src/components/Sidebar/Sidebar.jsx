/**
 * Sidebar Component
 * 
 * Ana sayfanın yan tarafında gösterilen sidebar. En popüler post'ları listeler ve
 * kategori filtreleme butonları içerir. Kategori seçildiğinde post'lar filtrelenir.
 */

import { useState } from "react";
import "./Sidebar.scss";
import SidebarItem from "./SidebarItem/SidebarItem.jsx";
import { CATEGORIES_ARRAY } from "../../constants/categories.js";
import { useSidebarPosts } from "../../features/post";

function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { posts, isLoading } = useSidebarPosts(selectedCategory);

  const handleCategoryClick = (category) => {
    // Aynı kategoriye tekrar tıklanırsa filtreyi kaldır
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="sidebar">
      <div className="subtitle">Most Popular</div>
      <div className="sidebar__list">
        {isLoading ? (
          <p>Loading...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <SidebarItem key={post.id} post={post} />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
      <div className="subtitle">Categories</div>
      <div className="sidebar__categories">
        {CATEGORIES_ARRAY.map((category) => (
          <div 
            key={category} 
            className={`sidebar__categories__item sidebar__categories__item--${category.toLowerCase().replace(/\s+/g, '-')} ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
