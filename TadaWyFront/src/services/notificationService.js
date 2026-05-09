import ApiClient from "./ApiClient";

export const getNotifications = () => ApiClient.get("/Notifications");

export const markAsRead = (id) => ApiClient.post(`/Notifications/mark-as-read?id=${id}`);

export const markAsReadPatch = (id) => ApiClient.patch(`/Notifications/${id}/read`);

export const markAllAsReadPatch = () => ApiClient.patch("/Notifications/allread");
