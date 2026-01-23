import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

function ProtectedRoute({ redirectTo = "/login" }) {
  const { isLoggedIn, isLoading } = useAuth();

  // Loading
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  // Giriş yapmamışsa login sayfasına yönlendir
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Giriş yapmışsa nested route'ları render et
  return <Outlet />;
}

export default ProtectedRoute;

