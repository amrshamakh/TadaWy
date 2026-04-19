import ApiClient from "@/services/ApiClient";

export function getDoctorSchedule() {
  return ApiClient.get("/Doctor/schedule");
}

export function updateDoctorSchedule(payload) {
  return ApiClient.post("/Doctor/schedule", payload);
}

export function getDoctorScheduleSummary() {
  return ApiClient.get("/Doctor/schedule/summary");
}
