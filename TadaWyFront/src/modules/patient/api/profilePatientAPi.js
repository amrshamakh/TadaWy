import ApiClient from "@/services/ApiClient";

export function getPatientProfile() {
  return ApiClient.get("/Patient/profile");
}

export function updatePatientProfile(data) {
  return ApiClient.put("/Patient/profile", data);
}
