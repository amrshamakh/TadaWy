import ApiClient from "@/services/ApiClient";

export function loginPatient(formData) {
  return ApiClient.post("/Auth/Login", {
    email: formData.email,
    password: formData.password,
  });
}
