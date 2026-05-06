import Pagination from "../components/Pagination";
import DoctorModal from "../components/DoctorModal";
import DoctorCard from "../components/AdminDoctorCard";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import { useAdminDoctors } from "../hooks/useAdminDoctors";

const AdminDoctors = () => {
  const { t } = useTranslation();
  const {
    filter,
    search,
    selectedDoctor,
    setSelectedDoctor,
    doctors,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    updateStatus,
    banDoctor,
    unbanDoctor
  } = useAdminDoctors();

  const filterOptions = [
    { value: "Approved", label: t("admin.doctors.approvedFilter") },
    { value: "Rejected", label: t("admin.doctors.rejectedFilter") },
    { value: "Pending",  label: t("admin.doctors.pendingFilter") },
    { value: "Banned",   label: t("admin.doctors.bannedFilter") },
  ];

  return (
    <div className="flex flex-col flex-1 h-full" >
       <div className="flex-1">
         {/* Search */}
      <input
        type="text"
        placeholder={t("admin.doctors.searchPlaceholder")}
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full border dark:text-white border-white dark:border-[#334155] rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100 dark:bg-[#3341554D] placeholder-gray-400 dark:placeholder-gray-500 transition-all font-medium"
      />

      {/* Filter Radio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 cursor-pointer mb-8 text-sm text-gray-700 dark:text-white font-medium">
        {filterOptions.map((item) => (
          <label key={item.value} className={`flex items-center justify-between border-2 py-2.5 px-4 rounded-xl transition-all ${filter === item.value ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-500/10 dark:border-teal-500/50 dark:text-teal-400' : 'bg-gray-100 border-transparent dark:bg-[#3341554D] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#33415580]'}`}>
             {`${item.label}`}
            <input
              type="radio"
              name="filter"
              value={item.value}
              checked={filter === item.value}
              onChange={() => handleFilterChange(item.value)}
              className="accent-teal-600 w-4 h-4 cursor-pointer"
            />
          </label>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 min-h-[50vh]">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500/20 border-t-teal-500"></div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">{t("admin.doctors.loading", "Loading...")}</p>
          </div>
        ) : doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onClick={setSelectedDoctor} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-[#1E293B]/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#334155]">
            <img src={assets.logo} className="w-16 h-16 opacity-20 dark:opacity-10 mb-4 grayscale" alt="No data" />
            <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">{t("admin.doctors.noResults")}</p>
          </div>
        )}
      </div>
       </div>

      {/* Pagination */}
      <div className="mt-auto py-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {/* Modal */}
      <DoctorModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onApprove={(d) => updateStatus(d, "Approved")}
        onReject={(d, reason) => updateStatus(d, "Rejected", reason)}
        onBan={(d, reason) => banDoctor(d, reason)}
        onUnban={unbanDoctor}
      />
      
    </div>
  );
};

export default AdminDoctors;