import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

function AdminProtectedRoute({ redirectTo = "/", loginRedirectTo = "/login" }) {
  const { user, isLoggedIn, isLoading } = useAuth();

  // Loading
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  // Giriş yapmamışsa login sayfasına yönlendir
  if (!isLoggedIn) {
    return <Navigate to={loginRedirectTo} replace />;
  }

  // Admin değilse ana sayfaya yönlendir
  if (user?.role !== "admin") {
    return <Navigate to={redirectTo} replace />;
  }

  // Admin ise nested route'ları render et
  return <Outlet />;
}

export default AdminProtectedRoute;

