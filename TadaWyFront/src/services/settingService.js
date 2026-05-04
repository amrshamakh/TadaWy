import ApiClient from "./ApiClient";

export const getSettings = () =>
  ApiClient.get("/Setting");

export const updateSettings = (data) =>
  ApiClient.put("/Setting/update", data);

export const changePassword = (data) =>
  ApiClient.put("/Setting/change-password", data);
