import axios from "axios";

const API_URL = "https://omarahmed176-alzheimer-detection-api.hf.space/predict/";

export const predictAlzheimer = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const { data } = await axios.post(API_URL, formData);
  console.log("API Response:", data);
  return data; // returns { predicted_class, mean, std, description }
};