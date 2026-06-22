import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const error = searchParams.get("error");

    if (error) {
      hasRun.current = true;
      if (error.includes("No account found")) {
        toast.info(error, {
          style: {
            background: "#0f766e",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "bold",
          },
          icon: "🚀",
        });
      } else {
        toast.error(`Login failed: ${error}`);
      }
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      hasRun.current = true;
      const handleLogin = async () => {
        try {
          await login(token);
          const normalizedRole = String(role || "").toLowerCase();

          if (normalizedRole === "doctor") navigate("/doctor/appointments", { replace: true });
          else if (normalizedRole === "admin") navigate("/admin", { replace: true });
          else navigate("/discover", { replace: true });

          toast.success("Welcome back!", {
            style: {
              background: "#0f766e",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: "bold",
            },
            icon: "👋",
          });
        } catch (err) {
          console.error("Callback login error:", err);
          toast.error("Failed to sync profile");
          navigate("/login", { replace: true });
        }
      };
      handleLogin();
    } else {
      hasRun.current = true;
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return <LoadingSpinner fullPage />;
};

export default GoogleCallback;
