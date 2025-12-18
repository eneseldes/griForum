import "./PostDetailPage.scss";
import CommentList from "../../components/CommentList/CommentList.jsx";
import LikeButton from "../../components/LikeButton/LikeButton.jsx";
import EditorOutput from "../../components/EditorOutput/EditorOutput.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import { FaRegClock } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { usePostDetail } from "../../hooks/usePostDetail";
import { getUserIdFromToken } from "../../services/api";
import { PostService } from "../../services/PostService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PostDetailPage() {
  const navigate = useNavigate();
  const { post, comments, setComments, loading, error, postId } = usePostDetail();
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (post) {
      const userId = getUserIdFromToken();
      const isLiked = userId && Array.isArray(post.likes) && post.likes.some(
        (likeId) => likeId.toString() === userId
      );
      setHasUserLiked(isLiked || false);
      setLikeCount(post.likesCount || 0);
      
      // Post sahibi kontrolü
      const ownerCheck = userId && post.authorId && (
        post.authorId.toString() === userId.toString() ||
        (post.raw?.author && post.raw.author.toString() === userId.toString())
      );
      setIsPostOwner(ownerCheck || false);
    }
  }, [post]);

  const handleEditPost = () => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDeletePost = async () => {
    try {
      await PostService.deletePost(postId);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      if (error.status === 401) {
        navigate("/login");
      } else {
        alert(error.data?.message || "Failed to delete post. Please try again.");
      }
    }
  };

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
                src={post.authorAvatar || "https://i.pravatar.cc/150?img=69"}
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
              <EditorOutput content={post.content} />
            </article>

            <div className="post-actions">
              <LikeButton
                type="post"
                id={postId}
                hasUserLiked={hasUserLiked}
                likeCount={likeCount}
                onLikeChange={(newLiked, newCount) => {
                  setHasUserLiked(newLiked);
                  setLikeCount(newCount);
                }}
              />
              {isPostOwner && (
                <div className="post-actions__owner-buttons">
                  <CustomButton
                    label="Edit"
                    onClick={handleEditPost}
                    variant="success"
                    icon={<FaEdit />}
                  />
                  <CustomButton
                    label="Delete"
                    onClick={() => setShowDeleteDialog(true)}
                    variant="danger"
                    icon={<FaTrash />}
                  />
                </div>
              )}
            </div>

            <ConfirmDialog
              isOpen={showDeleteDialog}
              onClose={() => setShowDeleteDialog(false)}
              onConfirm={handleDeletePost}
              title="Delete Post"
              message="Are you sure you want to delete this post? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              variant="danger"
            />

            <section className="post-comments">
              {loading && <p>Loading comments...</p>}
              <CommentList
                comments={comments}
                postId={postId}
                onAddComment={(newComment) =>
                  setComments((prev) => [newComment, ...prev])
                }
                onDeleteComment={(commentId) =>
                  setComments((prev) => prev.filter((c) => c.id !== commentId))
                }
              />
            </section>
          </main>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
