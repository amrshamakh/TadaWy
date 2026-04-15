import ApiClient from "@/services/ApiClient";

// ─── Profile ────────────────────────────────────────────────
export function getDoctorProfile() {
  return ApiClient.get("/Doctor/profile");
}

export function updateDoctorProfile(data) {
  return ApiClient.put("/Doctor/profile", data);
}

export function uploadDoctorImage(image) {
  const formData = new FormData();
  formData.append("image", image);
  return ApiClient.post("/Doctor/profile/image", formData);
}