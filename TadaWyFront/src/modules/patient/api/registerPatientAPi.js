import ApiClient from "@/services/ApiClient";

export function registerPatient(formData) {
  const { day, month, year } = formData.dateOfBirth;

  return ApiClient.post("/Auth/RegisterPatient", {
    email: formData.email,
    password: formData.password,
    confirmpassword: formData.confirmPassword,
    gendre: formData.gender === "male" ? 0 : 1,
    latitude: formData.latitude,
    longitude: formData.longitude,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phoneNumber: formData.phoneNumber,
    dateOfBirth: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  });
}