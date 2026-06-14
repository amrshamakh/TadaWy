import ApiClient from "@/services/ApiClient";

export function loginPatient(formData) {
  return ApiClient.post("/Auth/Login", {
    email: formData.email,
    password: formData.password,
  });
}

export function externalLogin(idToken) {
  return ApiClient.post("/Auth/ExternalLogin", {
    idToken: idToken,
    provider: "Google"
  });
}
