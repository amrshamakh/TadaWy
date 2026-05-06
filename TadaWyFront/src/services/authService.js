import ApiClient from "./ApiClient";

/**
 * Send a password-reset email to the given address.
 * @param {string} email
 */
export const forgotPassword = (email) =>
  ApiClient.post("/Auth/forget-password", { email });

/**
 * Reset the user's password.
 * The token MUST be passed in its raw URL-encoded form
 * (as it appears in the reset link) so ASP.NET Data Protection
 * can validate it correctly.
 *
 * @param {{ email: string, newPassword: string, confirmPassword: string, token: string }} payload
 */
export const resetPassword = ({ email, newPassword, confirmPassword, token }) =>
  ApiClient.post("/Auth/reset-password", {
    email,
    newPassword,
    confirmPassword,
    token,
  });

/**
 * Revoke the user's refresh token
 */
export const revokeToken = (token) =>
  ApiClient.post("/Auth/RevokeToken", { token });
