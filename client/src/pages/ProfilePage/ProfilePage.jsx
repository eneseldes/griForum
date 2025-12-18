import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services/UserService";
import { mapPostsFromApi } from "../../mappers/postMapper";
import PostList from "../../components/PostList/PostList.jsx";
import CustomButton from "../../components/CustomButton/CustomButton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import "./ProfilePage.scss";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userData, myPostsData, likedPostsData] = await Promise.all([
          UserService.getMe(),
          UserService.getMyPosts().catch(() => []),
          UserService.getLikedPosts().catch(() => []),
        ]);

        setUser(userData);
        setEmail(userData.email || "");
        setUsername(userData.username || "");
        setMyPosts(mapPostsFromApi(myPostsData));
        setLikedPosts(mapPostsFromApi(likedPostsData));
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty");
      setShowUpdateDialog(false);
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        username: username.trim(),
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const response = await UserService.updateProfile(payload);
      
      if (response) {
        setUser(response.user || response);
        setPassword(""); // Şifreyi temizle
        setShowUpdateDialog(false);
        // Başarı mesajı için başka bir dialog gösterebiliriz veya sadece kapatabiliriz
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setShowUpdateDialog(false);
      if (error.status === 401) {
        navigate("/login");
      } else {
        alert(error.data?.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <p>User not found.</p>
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
          onConfirm={handleUpdateProfile}
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
