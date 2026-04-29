import ApiClient from "@/services/ApiClient";

/**
 * Fetch all appointments for the logged-in doctor.
 * Returns: { totalAppointments, confirmedCount, pendingCount, cancelledCount, appointments: [...] }
 */
export function getDoctorAppointments() {
  return ApiClient.get("/Doctor/appointments");
}

/**
 * Confirm a pending appointment.
 * @param {string|number} id - Appointment ID
 */
export function confirmAppointment(id) {
  return ApiClient.post(`/Doctor/Appointments/confirm/${id}`);
}

/**
 * Cancel an appointment.
 * @param {string|number} id - Appointment ID
 */
export function cancelAppointment(id) {
  return ApiClient.post(`/Doctor/Appointments/cancel/${id}`);
}
