import ApiClient from "@/services/ApiClient";

export function getAllSpecializations() {
  return ApiClient.get("/Lookup/specializations");
}

export function createLookupSpecialization(name) {
  return ApiClient.post(`/Lookup/specializations?name=${encodeURIComponent(name)}`);
}
export function getStates() {
  return ApiClient.get("/Lookup/states");
}

export function getCitiesByState(stateId) {
  return ApiClient.get(`/Lookup/states/${stateId}/cities`);
}
