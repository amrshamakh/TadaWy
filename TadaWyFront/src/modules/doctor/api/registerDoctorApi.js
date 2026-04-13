import ApiClient from "@/services/ApiClient";

export function registerDoctor(formData) {
  const { day, month, year } = formData.dateOfBirth;

  return ApiClient.post("/Auth/RegisterDoctor", {
    email: formData.email,
    password: formData.password,
    ConfirmPassword: formData.confirmPassword,
    AddressDescription: formData.addressDescription,
    SpecializationId: formData.specializationId,
    CareerStartDate: formData.careerStartDate,
    Latitude: formData.latitude,
    Longitude: formData.longitude,
    FirstName: formData.firstName,
    LastName: formData.lastName,
    PhoneNumber: formData.phoneNumber,
    VerificationDocument: formData.verificationDocument,
  });
}