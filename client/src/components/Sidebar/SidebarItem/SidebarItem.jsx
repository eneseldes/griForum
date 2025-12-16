import "./SidebarItem.scss";

function SidebarItem({post = {}}) {
  return (
    <div className="sidebar-item">
        <div className="sidebar-item__category">{post.category.toUpperCase()}</div>
        <div className="sidebar-item__title">{post.title}</div>
        <div className="sidebar-item__kunye">
            <div className="sidebar-item__kunye__author">{post.author}</div>
            <div className="small-line">-</div>
            <div className="sidebar-item__kunye__date">{post.date}</div>
        </div>
    </div>
  );
}

export default SidebarItem;
