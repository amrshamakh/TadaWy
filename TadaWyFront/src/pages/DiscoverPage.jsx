import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Star, MapPin, Phone, Search, ArrowLeft, ArrowRight, Eraser } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";


import { clinicsData, ratings, locations } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { getDoctors } from "../modules/patient/api/doctorDiscoveryApi";
import { getAllSpecializations, getStates, getCitiesByState } from "../modules/doctor/api/lookupApi";
import { useLocalizedField } from "../hooks/useLocalizedField";
import Footer from "../components/Landing/Footer";
import { CardSkeleton } from "../components/Skeleton";

const CLINIC_PLACEHOLDER = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=300&fit=crop";


// Main Component
export default function DiscoverPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();
  const { isSidebarOpen } = useOutletContext() || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  
  const [specializations, setSpecializations] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const getLocalized = useLocalizedField();

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

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await getStates();
        setStates(data);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const data = await getCitiesByState(selectedStateId);
        setCities(data);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, [selectedStateId]);

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

  const getSpecialtyLabel = (s) => getLocalized(s, "name");

  const getRatingLabel = (value) =>
    value === "" ? t("discover.ratings.All Ratings") : t(`discover.ratings.${value}`, { defaultValue: value });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("");
    setSelectedRating("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedStateId("");
    setCurrentPage(1);
  };

  const handleBookAppointment = (doctor) => {
    navigate(`/booking/${doctor.id}`, { state: { doctor } });
  };

  return (
    <div className="min-h-screen">
      <div className={`max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12 mt-3 transition-all duration-300 ${isSidebarOpen ? "ms-8" : "mx-auto"}`}>
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
              <select
                value={selectedStateId}
                onChange={(e) => {
                  const stateId = e.target.value;
                  setSelectedStateId(stateId);
                  const stateObj = states.find(s => s.id.toString() === stateId);
                  setSelectedState(stateObj ? stateObj.nameEn : ""); // Use nameEn as value for backend filter
                  setSelectedCity("");
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 appearance-none border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">{t("auth.signup.state") || "State"}</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getLocalized(s, "name")}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* City Filter */}
            <div className="relative flex-1 min-w-50">
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={!selectedStateId}
                className="w-full px-4 py-2 pr-10 appearance-none border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              >
                <option value="">{t("auth.signup.city") || "City"}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.nameEn}>
                    {getLocalized(c, "name")}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={handleClearFilters}
              title={isAr ? "مسح جميع الفلاتر" : "Clear All Filters"}
              className="p-2 w-10 h-10 rounded-xl transition-colors flex justify-center items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-[#334155] text-gray-500 hover:text-teal-600 hover:border-teal-500 dark:hover:border-teal-500 transition-all shadow-sm"
            >
              <Eraser className="w-5 h-5" />
            </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 dark:bg-gray-800 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">{t("discover.noResults")}</p>
              <p className="text-gray-400 text-sm mt-2">{t("discover.adjustFilters")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="dark:bg-gray-800 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={doctor.imageUrl || CLINIC_PLACEHOLDER}
                      alt={doctor.doctorName}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
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