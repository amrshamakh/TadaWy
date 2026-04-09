import ApiClient from "@/services/ApiClient";

// ─── Profile ────────────────────────────────────────────────
export function getPatientProfile() {
  return ApiClient.get("/Patient/profile");
}

export function updatePatientProfile(data) {
  return ApiClient.put("/Patient/profile", data);
}

// ─── Patient Allergies ──────────────────────────────────────
export function getPatientAllergies() {
  return ApiClient.get("/Patient/allergies");
}

export function addPatientAllergy(id) {
  return ApiClient.post(`/Patient/allergies/${id}`);
}

export function removePatientAllergy(id) {
  return ApiClient.delete(`/Patient/allergies/${id}`);
}

// ─── Patient Chronic Diseases ───────────────────────────────
export function getPatientChronicDiseases() {
  return ApiClient.get("/Patient/chronic-diseases");
}

export function addPatientChronicDisease(id) {
  return ApiClient.post(`/Patient/chronic-diseases/${id}`);
}

export function removePatientChronicDisease(id) {
  return ApiClient.delete(`/Patient/chronic-diseases/${id}`);
}

// ─── Lookups (master lists) ─────────────────────────────────
export function getAllAllergies() {
  return ApiClient.get("/Lookup/allergies");
}

export function getAllChronicDiseases() {
  return ApiClient.get("/Lookup/chronic-diseases");
}
