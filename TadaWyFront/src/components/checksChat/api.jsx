import axiosInstance from "../../services/AxiosConfig";

export const getAlzheimerHistory = async (date = null, pageSize = 10) => {
  const params = { pageSize };
  if (date) {
    params.lastCreatedAt = date;
  }
  const { data } = await axiosInstance.get("/AiBrainScan/history", {
    params,
  });
  return data;
};

export const predictAlzheimer = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const { data } = await axiosInstance.post("/AiBrainScan/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("API Response:", data);
  return data;
};