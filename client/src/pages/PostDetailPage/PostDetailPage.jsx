import "./PostDetailPage.scss";
import CommentList from "../../components/CommentList/CommentList.jsx";
import CommentForm from "../../components/CommentList/CommentForm/CommentForm.jsx";
import LikeButton from "../../components/LikeButton/LikeButton.jsx";
import { FaRegClock } from "react-icons/fa6";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { usePostDetail } from "../../hooks/usePostDetail";

function PostDetailPage() {
  const { post, comments, loading, error } = usePostDetail();

  if (loading && !post) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p>Could not load post.</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: post.category, href: `/category/${post.category}` },
  ];

  return (
    <div className="post-detail-page">
      <div className="container">
        <nav className="breadcrumbs">
          {breadcrumbs.map((bc) => (
            <span key={bc.label} className="breadcrumbs__item">
              <a href={bc.href}>{bc.label}</a>
              <span className="breadcrumbs__sep"> / </span>
            </span>
          ))}
          <span className="breadcrumbs__current">{post.title}</span>
        </nav>

        <div className="layout">
          <div className="content-header">
            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta">
              <img
                className="post-meta__avatar"
                src={post.image}
                alt={post.title}
              />
              <div className="post-meta__info">
                <span className="post-meta__author">
                  {post.authorName || "Unknown"}
                </span>
                <span className="post-meta__date">
                  <FaRegClock /> {post.date}
                </span>
              </div>
            </div>
          </div>

          <main className="content-body">
            <article className="post-body">
              <p>{post.content}</p>
            </article>

            <div className="post-actions">
              <LikeButton />
            </div>

            <section className="post-comments">
              <CommentForm />
              {loading && <p>Loading comments...</p>}
              <CommentList comments={comments} />
            </section>
          </main>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
