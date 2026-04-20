import ApiClient from "../../../services/ApiClient";

export const createOfflineAppointment = async (payload) => {
  try {
    const response = await ApiClient.post("/Appointments/offline", payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(typeof error.response.data === 'string' ? error.response.data : error.response.data.title || "Failed to book");
    }
    throw error;
  }
};

export const createOnlineAppointment = async (payload) => {
  const response = await ApiClient.post("/Appointments/online", payload);
  return response.data;
};
