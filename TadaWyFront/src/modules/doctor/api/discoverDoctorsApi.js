import ApiClient from "@/services/ApiClient";

export function getPublicDoctors(params = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.specializationId != null) q.set("specializationId", String(params.specializationId));
  if (params.minRating != null) q.set("minRating", String(params.minRating));
  if (params.state) q.set("state", params.state);
  if (params.city) q.set("city", params.city);
  q.set("pageNumber", String(params.pageNumber ?? 1));
  q.set("pageSize", String(params.pageSize ?? 50));
  return ApiClient.get(`/Doctor?${q.toString()}`);
}

export function getPublicDoctorById(id) {
  return ApiClient.get(`/Doctor/${id}`);
}
