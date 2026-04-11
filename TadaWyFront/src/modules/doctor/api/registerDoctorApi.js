import ApiClient from "@/services/ApiClient";

export function registerDoctor(data) {
  const formData = new FormData();
  
  // Basic fields
  formData.append("Email", data.email);
  formData.append("Password", data.password);
  formData.append("ConfirmPassword", data.confirmPassword);
  formData.append("FirstName", data.firstName);
  formData.append("LastName", data.lastName);
  formData.append("PhoneNumber", data.phoneNumber);
  
  // Location
  formData.append("AddressDescription", data.addressDetails || "");
  formData.append("Latitude", data.latitude);
  formData.append("Longitude", data.longitude);
  
  // Professional
  formData.append("SpecializationId", data.specializationId);
  formData.append("CareerStartDate", data.careerStartDate);
  
  // Date of Birth
  if (data.dateOfBirth) {
    formData.append("DateOfBirth", data.dateOfBirth);
  }

  // Files
  if (data.cv) {
    formData.append("VerificationDocument", data.cv);
  }

  return ApiClient.post("/Auth/RegisterDoctor", formData);
}
