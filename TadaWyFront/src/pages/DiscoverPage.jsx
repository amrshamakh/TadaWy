import { useState, useMemo } from "react";
import { Star, MapPin, Phone, Grid, List, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";


import { clinicsData, specialties, ratings, locations } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";


// Main Component
export default function DiscoverPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Helpers: pull translated label for a clinic field, fall back to raw value
  const getClinicField = (clinic, field) =>
    t(`discover.clinicsData.${clinic.id}.${field}`, { defaultValue: clinic[field] });

  const getSpecialtyLabel = (value) =>
    t(`discover.specialties.${value}`, { defaultValue: value });

  const getRatingLabel = (value) =>
    t(`discover.ratings.${value}`, { defaultValue: value });

  const getLocationLabel = (value) =>
    t(`discover.locations.${value}`, { defaultValue: value });

  // Filter still uses raw English values from assets so logic stays consistent
  const filteredClinics = useMemo(() => {
    return clinicsData.filter((clinic) => {
      const translatedName = t(`discover.clinicsData.${clinic.id}.name`, { defaultValue: clinic.name });
      const translatedDoctor = t(`discover.clinicsData.${clinic.id}.doctor`, { defaultValue: clinic.doctor });
      const translatedSpecialty = t(`discover.clinicsData.${clinic.id}.specialty`, { defaultValue: clinic.specialty });

      const matchesSearch =
        searchQuery === "" ||
        translatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translatedDoctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translatedSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        clinic.specialty === selectedSpecialty;

      let matchesRating = true;
      if (selectedRating !== "All Ratings") {
        const minRating = parseFloat(selectedRating.replace("+", ""));
        matchesRating = clinic.rating >= minRating;
      }

      const matchesLocation =
        selectedLocation === "All Locations" ||
        clinic.address.includes(selectedLocation);

      return matchesSearch && matchesSpecialty && matchesRating && matchesLocation;
    });
  }, [searchQuery, selectedSpecialty, selectedRating, selectedLocation, t]);

  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClinics = filteredClinics.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSpecialty, selectedRating, selectedLocation]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookAppointment = (clinic) => {
    navigate("/booking", { state: { doctor: clinic } });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
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
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 pr-10 appearance-none border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:ring-2 focus:ring-teal-500"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
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
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-4 py-2 pr-10 appearance-none border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:ring-2 focus:ring-teal-500"
              >
                {ratings.map((r) => (
                  <option key={r} value={r}>
                    {getRatingLabel(r)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative flex-1 min-w-50">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 pr-10 appearance-none border dark:border-[#334155] outline-0 dark:text-gray-400 border-white rounded-lg dark:bg-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {getLocationLabel(l)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              {t("discover.showing")} {startIndex + 1}–
              {Math.min(endIndex, filteredClinics.length)} {t("discover.of")}{" "}
              {filteredClinics.length} {t("discover.clinics")}
            </span>
          </div>
        </div>

        {/* Clinic Grid / List */}
        {filteredClinics.length === 0 ? (
          <div className="text-center py-12 dark:bg-gray-800 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">{t("discover.noResults")}</p>
            <p className="text-gray-400 text-sm mt-2">{t("discover.adjustFilters")}</p>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {currentClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="dark:bg-gray-800 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={clinic.image}
                      alt={getClinicField(clinic, "name")}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-2">
                      {getClinicField(clinic, "doctor")}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium dark:text-white">
                          {clinic.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        • {getClinicField(clinic, "specialty")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getClinicField(clinic, "address")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookAppointment(clinic)}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      {t("discover.bookAppointment")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}