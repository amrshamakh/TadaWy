import axiosInstance from "@/services/AxiosConfig";

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
  formData.append("Latitude", String(data.latitude));
  formData.append("Longitude", String(data.longitude));
  
  // Professional
  formData.append("SpecializationId", String(data.specializationId));
  formData.append("CareerStartDate", data.careerStartDate);
  
  // Files — must be a real File object
  if (data.cv) {
    formData.append("VerificationDocument", data.cv, data.cv.name);
  }

  // Clear Content-Type so axios can set multipart/form-data with the correct boundary
  return axiosInstance.post("/Auth/RegisterDoctor", formData, {
    headers: { "Content-Type": undefined },
  }).then((res) => res.data);
}

