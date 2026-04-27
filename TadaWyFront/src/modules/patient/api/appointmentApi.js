import ApiClient from "@/services/ApiClient";

/**
 * Books an offline appointment.
 * 
 * @param {Object} payload 
 * @param {number} payload.doctorId
 * @param {string} payload.date
 * @param {number} payload.amount
 */
export function bookOfflineAppointment(payload) {
  return ApiClient.post("/Appointments/offline", payload);
}

/**
 * Books an online appointment.
 * 
 * @param {Object} payload 
 * @param {number} payload.doctorId
 * @param {string} payload.date
 * @param {number} payload.amount
 */
export function bookOnlineAppointment(payload) {
  return ApiClient.post("/Appointments/online", payload);
}
