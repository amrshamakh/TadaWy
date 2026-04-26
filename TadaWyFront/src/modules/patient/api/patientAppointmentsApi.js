import ApiClient from "../../../services/ApiClient";

export const getAppointmentsByStatus = async (status) => {
  try {
    return await ApiClient.get(`/Patient/Appoiments/by-status?status=${status}`);
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    throw error;
  }
};

export const getAppointmentsByDate = async (dateStr) => {
  try {
    return await ApiClient.get(`/Patient/Appoiments/by-date?date=${encodeURIComponent(dateStr)}`);
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    throw error;
  }
};

export const getCalendarAppointments = async (month, year) => {
  try {
    return await ApiClient.get(`/Patient/Appoiments/calendar?month=${month}&year=${year}`);
  } catch (error) {
    console.error("Error fetching calendar appointments:", error);
    throw error;
  }
};

export const cancelAppointment = async (id) => {
  try {
    return await ApiClient.post(`/Patient/Appoiments/cancel/${id}`);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
};

export const getAppointmentReceipt = async (id) => {
  try {
    return await ApiClient.get(`/Patient/Appoiments/receipt/${id}`);
  } catch (error) {
    console.error("Error fetching appointment receipt:", error);
    throw error;
  }
};
