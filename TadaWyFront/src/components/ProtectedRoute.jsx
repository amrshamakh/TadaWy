import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";

export default function ProtectedRoute({ children, allowedRoles, renderBlockedContent = false }) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    const handleCancel = () => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    };

    if (renderBlockedContent) {
      return (
        <>
          {children}
          <AuthRequiredModal
            onLogin={() => navigate("/login", { state: { from: location.pathname } })}
            onCancel={handleCancel}
          />
        </>
      );
    }

    return (
      <AuthRequiredModal
        onLogin={() => navigate("/login", { state: { from: location.pathname } })}
        onCancel={handleCancel}
      />
    );
  }

  if (allowedRoles?.length) {
    const normalizedRole = role?.toLowerCase();
    const isAllowed = allowedRoles.some((item) => item.toLowerCase() === normalizedRole);
    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
