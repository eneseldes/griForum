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
import { usePost } from "../../hooks/post/usePost";
import { useDeletePost } from "../../hooks/post/useDeletePost";
import { DEFAULT_AVATAR } from "../../constants/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostDetailPage() {
  const navigate = useNavigate();
  const {
    post,
    comments,
    setComments,
    isLoading: loading,
    error,
    postId,
    isOwner: isPostOwner,
    hasUserLiked,
    likeCount,
    setHasUserLiked,
    setLikeCount,
  } = usePost();
  const { deletePost, isDeleting } = useDeletePost();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    <div className="post-detail-page container">
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
              src={post.authorAvatar || DEFAULT_AVATAR}
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
                  onClick={() => navigate(`/edit-post/${postId}`)}
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
            onConfirm={async () => {
              const success = await deletePost(postId);
              if (!success) {
                setShowDeleteDialog(false);
              }
            }}
            title="Delete Post"
            message="Are you sure you want to delete this post? This action cannot be undone."
            confirmText={isDeleting ? "Deleting..." : "Delete"}
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
  );
}

export default PostDetailPage;
