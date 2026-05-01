import ApiClient from "./ApiClient";

/**
 * Fetch all conversations for the current user (sidebar list).
 * @returns {Promise<Array>} list of conversation objects
 */
export const getConversations = () => ApiClient.get("/Chat/conversations");

/**
 * Fetch full message history with a specific user.
 * @param {string} otherUserId
 * @returns {Promise<Array>} list of message objects
 */
export const getChatHistory = (otherUserId) =>
  ApiClient.get(`/Chat/history?otherUserId=${otherUserId}`);

/**
 * Upload an image/file attachment and receive its hosted URL.
 * @param {File} file
 * @returns {Promise<{ imageUrl: string }>}
 */
export const uploadChatImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return ApiClient.post("/Chat/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Mark all messages in a conversation as seen.
 * @param {string} otherUserId
 * @returns {Promise<void>}
 */
export const markAsSeen = (otherUserId) =>
  ApiClient.post(`/Chat/mark-as-seen?otherUserId=${otherUserId}`);
