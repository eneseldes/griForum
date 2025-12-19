/**
 * SidebarItem Component
 * 
 * Sidebar'da gösterilen tek bir post item'ı. Post başlığı, kategori, yazar ve tarih bilgilerini içerir.
 */

import "./SidebarItem.scss";

import { Link } from "react-router-dom";

function SidebarItem({post = {}}) {
  return (
    <Link to={post.link || `/post/${post.id}`} className="sidebar-item__link">
      <div className="sidebar-item">
          <div className="sidebar-item__category">{post.category?.toUpperCase() || ''}</div>
          <div className="sidebar-item__title">{post.title}</div>
          <div className="sidebar-item__kunye">
              <div className="sidebar-item__kunye__author">{post.authorName || 'Unknown'}</div>
              <div className="small-line">-</div>
              <div className="sidebar-item__kunye__date">{post.date}</div>
          </div>
      </div>
    </Link>
  );
}

export default SidebarItem;
