/**
 * useProfile Hook
 * 
 * Kullanıcı profil verilerini yöneten custom hook. Kullanıcı bilgilerini,
 * kullanıcının post'larını, beğendiği post'ları fetch eder ve profil
 * güncelleme işlemini yönetir.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "./UserService";
import { mapPostsFromApi } from "../post/postMapper";
import { handleApiError } from "../../utils/errorHandler";
import { showError } from "../../utils/toast";

export function useProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const [userData, myPostsData, likedPostsData] = await Promise.all([
          UserService.getMe(),
          UserService.getMyPosts().catch(() => []),
          UserService.getLikedPosts().catch(() => []),
        ]);

        setUser(userData);
        setMyPosts(mapPostsFromApi(myPostsData));
        setLikedPosts(mapPostsFromApi(likedPostsData));
      } catch (error) {
        handleApiError(error, navigate, "Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const updateProfile = async (username, password) => {
    if (!username.trim()) {
      showError("Username cannot be empty");
      return false;
    }

    setIsSubmitting(true);
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
        return true;
      }
      return false;
    } catch (error) {
      handleApiError(error, navigate, "Failed to update profile. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { user, myPosts, likedPosts, isLoading, isSubmitting, updateProfile };
}

export default useProfile;

