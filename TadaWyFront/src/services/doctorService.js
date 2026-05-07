import ApiClient from "./ApiClient";

/**
 * Get doctor appointments and stats.
 * @returns {Promise<{totalAppointments: number, confirmedCount: number, pendingCount: number, cancelledCount: number, appointments: Array}>}
 */
export const getDoctorAppointments = () => ApiClient.get("/Doctor/appointments");

/**
 * Get patient profile details for doctor.
 * @param {string|number} patientId
 * @returns {Promise<any>}
 */
export const getPatientProfile = (patientId) => ApiClient.get(`/Doctor/patient-profile/${patientId}`);
