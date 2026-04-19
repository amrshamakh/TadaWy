import ApiClient from "@/services/ApiClient";

export function getDoctorAppointments() {
    return ApiClient.get("/Doctor/appointments");
}
