import ApiClient from "@/services/ApiClient";

/**
 * Fetches a list of doctors based on search and filter criteria.
 * 
 * @param {Object} params - The search and filter parameters.
 * @param {string} params.Search - Name or specialty search string.
 * @param {number} params.SpecializationId - ID of the specialization.
 * @param {number} params.MinRating - Minimum rating.
 * @param {string} params.State - State/Province.
 * @param {string} params.City - City.
 * @param {number} params.PageNumber - Page number for pagination.
 * @param {number} params.PageSize - Number of items per page.
 */
export function getDoctors(params) {
  // Clean empty params
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All Specialties" && value !== "All Ratings" && value !== "All Locations") {
      acc[key] = value;
    }
    return acc;
  }, {});

  return ApiClient.get("/Doctor", { params: cleanParams });
}
