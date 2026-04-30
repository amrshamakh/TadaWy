import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { forgotPassword as forgotPasswordApi } from "../services/authService";

/**
 * Encapsulates all logic for the Forgot Password page.
 * Returns state and handlers for the UI to consume.
 */
export const useForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      toast.success(t("forgotPassword.sentSuccess"));
      setEmail("");
    } catch (err) {
      console.error("Forgot-password error:", err?.response ?? err);
      const data = err?.response?.data;
      let message = t("forgotPassword.errorGeneric");

      if (typeof data === "string" && data.trim()) {
        message = data;
      } else if (data?.message && typeof data.message === "string") {
        message = data.message;
      } else if (data?.title && typeof data.title === "string") {
        message = data.title;
      } else if (data?.errors) {
        const firstField = Object.values(data.errors)[0];
        message = Array.isArray(firstField) ? firstField[0] : String(firstField);
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, handleSubmit };
};
