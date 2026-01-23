import { useState, useEffect } from "react";
import PostList from "../../components/PostList/PostList.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import { useProfile } from "../../hooks/user/useProfile";
import { usePosts } from "../../hooks/post/usePosts";
import "./ProfilePage.scss";

function ProfilePage() {
  const { user, isLoading: userLoading, isSubmitting, updateProfile } = useProfile();
  const { posts: myPosts, isLoading: myPostsLoading } = usePosts({ type: 'shared' });
  const { posts: likedPosts, isLoading: likedPostsLoading } = usePosts({ type: 'liked' });
  const isLoading = userLoading || myPostsLoading || likedPostsLoading;
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // Form state'lerini user data ile senkronize et
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setUsername(user.username || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <p>User not found.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="profile-page__title">Profile</h1>

        <div className="profile-page__content">
          {/* Update User Info Section */}
          <section className="profile-section">
            <h2 className="profile-section__title">Update User Info</h2>
            <div className="profile-form">
              <div className="profile-form__field">
                <label className="profile-form__label">Email</label>
                <input
                  type="email"
                  className="profile-form__input"
                  value={email}
                  readOnly
                  disabled
                />
              </div>

              <div className="profile-form__field">
                <label className="profile-form__label">Username</label>
                <input
                  type="text"
                  className="profile-form__input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div className="profile-form__field">
                <label className="profile-form__label">New Password (leave empty to keep current)</label>
                <input
                  type="password"
                  className="profile-form__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="profile-form__actions">
                <CustomButton
                  label="Update"
                  onClick={() => setShowUpdateDialog(true)}
                  variant="success"
                />
              </div>
            </div>
          </section>

          {/* My Posts Section */}
          <section className="profile-section">
            <h2 className="profile-section__title">My Posts</h2>
            {myPosts.length > 0 ? (
              <PostList posts={myPosts} />
            ) : (
              <p className="profile-section__empty">You haven't created any posts yet.</p>
            )}
          </section>

          {/* Liked Posts Section */}
          <section className="profile-section">
            <h2 className="profile-section__title">Liked Posts</h2>
            {likedPosts.length > 0 ? (
              <PostList posts={likedPosts} />
            ) : (
              <p className="profile-section__empty">You haven't liked any posts yet.</p>
            )}
          </section>
        </div>

        <ConfirmDialog
          isOpen={showUpdateDialog}
          onClose={() => setShowUpdateDialog(false)}
          onConfirm={async () => {
            const success = await updateProfile(username, password);
            if (success) {
              setPassword("");
              setShowUpdateDialog(false);
            } else {
              setShowUpdateDialog(false);
            }
          }}
          title="Update Profile"
          message="Are you sure you want to update your profile information?"
          confirmText="Update"
          cancelText="Cancel"
          variant="default"
        />
      </div>
    </div>
  );
}

export default ProfilePage;
