import { useState, useMemo } from "react";
import { Star, MapPin, Phone, Grid, List, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";


import { clinicsData, ratings, locations } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { getDoctors } from "../modules/patient/api/doctorDiscoveryApi";
import { getAllSpecializations } from "../modules/doctor/api/lookupApi";
import { useEffect } from "react";
import Footer from "../components/Landing/Footer";

const CLINIC_PLACEHOLDER = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=300&fit=crop";


// Main Component
export default function DiscoverPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const data = await getAllSpecializations();
        setSpecializations(data);
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {
          Search: searchQuery,
          SpecializationId: selectedSpecialty || undefined,
          MinRating: selectedRating ? parseFloat(selectedRating.replace("+", "")) : undefined,
          State: selectedState || undefined,
          City: selectedCity || undefined,
          PageNumber: currentPage,
          PageSize: itemsPerPage
        };
        const response = await getDoctors(params);
        setDoctors(response.items);
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError(t("common.error") || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDoctors();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, selectedSpecialty, selectedRating, selectedState, selectedCity, currentPage, t]);

  // Helper to format location and hide "UnKnown"
  const formatLocation = (city, street) => {
    const c = city === "UnKnown" ? "" : city;
    const s = street === "UnKnown" ? "" : street;
    const parts = [c, s].filter(p => p && p.trim() !== "");
    return parts.join(", ");
  };

  const getSpecialtyLabel = (s) => s.name;

  const getRatingLabel = (value) =>
    value === "" ? t("discover.ratings.All Ratings") : t(`discover.ratings.${value}`, { defaultValue: value });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookAppointment = (doctor) => {
    navigate(`/booking/${doctor.id}`, { state: { doctor } });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-2">
            {t("discover.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-[16px]">
            {t("discover.subtitle")}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          {/* Search */}
          <div className="mb-4 relative border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("discover.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-[#334155] border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Specialty Filter */}
            <div className="relative flex-1 min-w-50">
              <select
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 appearance-none border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">{t("discover.specialties.All Specialties")}</option>
                {specializations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getSpecialtyLabel(s)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Rating Filter */}
            <div className="relative flex-1 min-w-37.5">
              <select
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 appearance-none border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:ring-2 focus:ring-teal-500"
              >
                {ratings.map((r) => (
                  <option key={r} value={r === "All Ratings" ? "" : r}>
                    {getRatingLabel(r)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* State Filter */}
            <div className="relative flex-1 min-w-50">
              <input
                type="text"
                placeholder={t("auth.signup.state") || "State"}
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* City Filter */}
            <div className="relative flex-1 min-w-50">
              <input
                type="text"
                placeholder={t("auth.signup.city") || "City"}
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 w-9 h-9 rounded-xl transition-colors flex justify-center items-center ${viewMode === "grid"
                  ? "bg-teal-500 text-white border"
                  : "text-gray-600 hover:bg-gray-200 border border-gray-300"
                  }`}
              >
                <Grid className="w-4 h-4 dark:text-white" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 w-9 h-9 rounded-xl transition-colors ${viewMode === "list"
                  ? "bg-teal-500 text-white"
                  : "text-gray-600 hover:bg-gray-200 border border-gray-300"
                  }`}
              >
                <List className="w-5 h-5 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>
              {t("discover.showing")} {doctors.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
              {Math.min(currentPage * itemsPerPage, totalCount)} {t("discover.of")}{" "}
              {totalCount} {t("discover.clinics")}
            </span>
          </div>
        </div>

        {/* Clinic Grid / List */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 dark:bg-gray-800 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">{t("discover.noResults")}</p>
              <p className="text-gray-400 text-sm mt-2">{t("discover.adjustFilters")}</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="dark:bg-gray-800 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={CLINIC_PLACEHOLDER}
                      alt={doctor.doctorName}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-2">
                      {doctor.doctorName}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium dark:text-white">
                          {doctor.rate || 0}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        • {doctor.specialization}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 mb-4 min-h-[40px]">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatLocation(doctor.city, doctor.street)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookAppointment(doctor)}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      {t("discover.bookAppointment")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}