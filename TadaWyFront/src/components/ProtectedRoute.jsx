import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";

export default function ProtectedRoute({ children, allowedRoles, renderBlockedContent = false }) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRoleBlocked =
    !!user &&
    !!allowedRoles?.length &&
    !allowedRoles.some((item) => item.toLowerCase() === role?.toLowerCase());

  // ✅ All hooks are called unconditionally at the top — Rules of Hooks compliant
  useEffect(() => {
    if (!loading && isRoleBlocked) {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [loading, isRoleBlocked, navigate]);

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

  // Render nothing while the back-navigation effect fires
  if (isRoleBlocked) return null;

  return children;
}
