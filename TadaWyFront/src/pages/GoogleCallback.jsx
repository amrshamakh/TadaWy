import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const error = searchParams.get("error");

    if (error) {
      toast.error(`Login failed: ${error}`);
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      const handleLogin = async () => {
        try {
          await login(token);
          const normalizedRole = String(role || "").toLowerCase();
          
          if (normalizedRole === "doctor") navigate("/doctor/appointments", { replace: true });
          else if (normalizedRole === "admin") navigate("/admin", { replace: true });
          else navigate("/discover", { replace: true });
          
          toast.success("Welcome back!");
        } catch (err) {
          console.error("Callback login error:", err);
          toast.error("Failed to sync profile");
          navigate("/login", { replace: true });
        }
      };
      handleLogin();
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return <LoadingSpinner fullPage />;
};

export default GoogleCallback;
