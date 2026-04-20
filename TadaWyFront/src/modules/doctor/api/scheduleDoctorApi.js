import ApiClient from "@/services/ApiClient";

export function getDoctorSchedule() {
  return ApiClient.get("/Doctor/schedule");
}

export function updateDoctorSchedule(data) {
  return ApiClient.post("/Doctor/schedule", data);
}

export function addDoctorTimeSlot(data) {
  return ApiClient.post("/Doctor/schedule/timeslot", data);
}

export function getDoctorScheduleSummary() {
  return ApiClient.get("/Doctor/schedule/summary");
}
