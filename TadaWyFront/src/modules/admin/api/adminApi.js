import ApiClient from "@/services/ApiClient";

const AdminApi = {
  /**
   * Fetch doctors with filters
   * @param {Object} params { Status, Search, PageNumber, PageSize }
   */
  getDoctors: (params) => {
    return ApiClient.get("/Admin/doctors", { params });
  },

  /**
   * Fetch specific doctor details
   */
  getDoctorById: (id) => {
    return ApiClient.get(`/Admin/doctors/${id}`);
  },

  /**
   * Approve a pending doctor
   */
  approveDoctor: (id) => {
    return ApiClient.put(`/Admin/approve-doctor/${id}`);
  },

  /**
   * Reject a doctor application with a reason
   */
  rejectDoctor: (id, reason) => {
    return ApiClient.put(`/Admin/reject-doctor/${id}`, null, {
      params: { RejectionReason: reason },
    });
  },

  /**
   * Ban an approved doctor for a reason
   */
  banDoctor: (id, reason) => {
    // Note: Depends on how the backend expects the string. 
    // Usually [FromBody] string expects a quoted string if JSON.
    return ApiClient.put(`/Admin/ban-doctor/${id}`, JSON.stringify(reason), {
        headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * Unban a doctor
   */
  unbanDoctor: (id) => {
    return ApiClient.put(`/Admin/unban-doctor/${id}`);
  },

  /**
   * Get specialization lookups
   */
  getSpecializations: () => {
    return ApiClient.get("/Lookup/specializations");
  }
};

export default AdminApi;
