import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { resetPassword as resetPasswordApi } from "../services/authService";

/**
 * Extract a query param from the current URL in its RAW (URL-encoded) form.
 * useSearchParams / URLSearchParams both decode the value automatically,
 * but ASP.NET Data Protection tokens must be sent encoded (with %2F, %2B …).
 */
const getRawParam = (name) => {
  const raw = window.location.search.slice(1);
  const regex = new RegExp(`(?:^|&)${name}=([^&]*)`);
  const match = raw.match(regex);
  return match ? match[1] : "";
};

/** ASP.NET Identity error code → friendly message map */
const IDENTITY_ERROR_MAP = {
  PasswordMismatch:                   "Passwords do not match.",
  PasswordRequiresNonAlphanumeric:    "Password must contain at least one symbol (e.g. @, #, !).",
  PasswordRequiresDigit:              "Password must contain at least one digit (0–9).",
  PasswordRequiresLower:              "Password must contain at least one lowercase letter.",
  PasswordRequiresUpper:              "Password must contain at least one uppercase letter.",
  PasswordTooShort:                   "Password is too short (minimum 8 characters).",
  InvalidToken:                       "Reset link is invalid or has expired. Please request a new one.",
  UserNotFound:                       "No account found with that email address.",
  InvalidEmail:                       "The email address is invalid.",
};

/**
 * Extract the most meaningful human-readable message from an Axios error.
 * Handles: plain string, { message }, ProblemDetails { title },
 * ModelState { errors: { field: ["msg"] } },
 * and ASP.NET Identity arrays [{ code, description }].
 */
const extractApiError = (err, fallback) => {
  const data = err?.response?.data;
  if (!data) return fallback;

  // Plain string
  if (typeof data === "string" && data.trim()) return data;

  // ASP.NET Identity result: { errors: [{ code, description }] }
  if (Array.isArray(data?.errors) && data.errors[0]?.code) {
    const { code, description } = data.errors[0];
    return IDENTITY_ERROR_MAP[code] || description || fallback;
  }

  // ModelState: { errors: { Field: ["msg", ...] } }
  if (data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
    const firstField = Object.values(data.errors)[0];
    return Array.isArray(firstField) ? firstField[0] : String(firstField);
  }

  // { message: "..." }
  if (data?.message && typeof data.message === "string") return data.message;

  // ProblemDetails { title: "..." }
  if (data?.title && typeof data.title === "string") return data.title;

  return fallback;
};

// ─── Password rules (mirrors ASP.NET Identity defaults) ──────────────────────
export const PASSWORD_RULES = [
  { id: "length",  label: "At least 8 characters",          test: (v) => v.length >= 8 },
  { id: "upper",   label: "One uppercase letter (A-Z)",     test: (v) => /[A-Z]/.test(v) },
  { id: "lower",   label: "One lowercase letter (a–z)",     test: (v) => /[a-z]/.test(v) },
  { id: "digit",   label: "One number (0–9)",               test: (v) => /\d/.test(v) },
  { id: "symbol",  label: "One symbol (@ # $ % ! …)",       test: (v) => /[^a-zA-Z0-9]/.test(v) },
];

const isPasswordValid = (password) =>
  PASSWORD_RULES.every((rule) => rule.test(password));

// ─────────────────────────────────────────────────────────────────────────────

export const useResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const email = getRawParam("email");
  const token = getRawParam("token");

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [formErrors, setFormErrors] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = { newPassword: "", confirmPassword: "" };
    let hasError = false;

    const failedRule = PASSWORD_RULES.find((rule) => !rule.test(formData.newPassword));
    if (failedRule) {
      nextErrors.newPassword = `Password must include: ${failedRule.label.toLowerCase()}.`;
      hasError = true;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    setFormErrors(nextErrors);
    if (hasError) return;

    if (!email || !token) {
      toast.error("Invalid or missing reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi({
        email: decodeURIComponent(email),
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        token,
      });
      toast.success("Password reset successfully! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Reset-password error:", err?.response ?? err);
      const message = extractApiError(err, "Something went wrong. Please try again.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { formData, formErrors, loading, handleChange, handleSubmit };
};
