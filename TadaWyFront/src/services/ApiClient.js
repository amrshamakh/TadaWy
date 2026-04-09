import axiosInstance from "./AxiosConfig";

class ApiClient {
  async get(url, params) {
    const res = await axiosInstance.get(url, { params });
    return res.data;
  }
  async post(url, data) {
    const res = await axiosInstance.post(url, data);
    return res.data;
  }
  async put(url, data) {
    const res = await axiosInstance.put(url, data);
    return res.data;
  }
  async delete(url) {
    const res = await axiosInstance.delete(url);
    return res.data;
  }
}
export default new ApiClient();