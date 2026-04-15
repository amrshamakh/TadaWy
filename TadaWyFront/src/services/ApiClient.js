import axiosInstance from "./AxiosConfig";

class ApiClient {
  async get(url, config = {}) {
    const res = await axiosInstance.get(url, config);
    return res.data;
  }
  async post(url, data, config = {}) {
    const res = await axiosInstance.post(url, data, config);
    return res.data;
  }
  async put(url, data, config = {}) {
    const res = await axiosInstance.put(url, data, config);
    return res.data;
  }
  async delete(url, config = {}) {
    const res = await axiosInstance.delete(url, config);
    return res.data;
  }
}
export default new ApiClient();