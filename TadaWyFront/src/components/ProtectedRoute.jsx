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

  // Redirect role-blocked users back to the last page they were on
  useEffect(() => {
    if (!loading && isRoleBlocked) {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [loading, isRoleBlocked, navigate]);

  // Redirect unauthenticated users on hard-protected routes straight to "/"
  useEffect(() => {
    if (!loading && !user && !renderBlockedContent) {
      navigate("/", { replace: true });
    }
  }, [loading, user, renderBlockedContent, navigate]);

  if (loading) return null;

  if (!user) {
    // Soft-protected: show content beneath + modal overlay (e.g. calendar)
    if (renderBlockedContent) {
      return (
        <>
          {children}
          <AuthRequiredModal
            onLogin={() => navigate("/login", { state: { from: location.pathname } })}
            onCancel={() => navigate("/", { replace: true })}
          />
        </>
      );
    }

    // Hard-protected: silently redirect to home (e.g. /doctor, /admin after logout)
    return null; // useEffect below handles the navigation
  }

  // Render nothing while the back-navigation effect fires
  if (isRoleBlocked) return null;

  return children;
}
