import { useEffect, useMemo, useState } from "react";
import Pagination from "../components/Pagination";
import DoctorModal from "../components/DoctorModal";
import DoctorCard from "../components/AdminDoctorCard";
import { useDoctors } from "../context/doctorContext";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";


const AdminDoctors = () => {
 
  const { t } = useTranslation();
  const [filter, setFilter] = useState("Approved");
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { doctors, totalCount, fetchDoctors, loading, updateStatus, banDoctor, unbanDoctor } = useDoctors();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchDoctors({
      Status: filter,
      Search: search,
      PageNumber: currentPage,
      PageSize: ITEMS_PER_PAGE
    });
  }, [filter, search, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const paginated = doctors; // Since API already does pagination
  
  const filterOptions = [
    { value: "Approved", label: t("admin.doctors.approvedFilter") },
    { value: "Rejected", label: t("admin.doctors.rejectedFilter") },
    { value: "Pending",  label: t("admin.doctors.pendingFilter") },
    { value: "Banned",   label: t("admin.doctors.bannedFilter") },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  

  return (
    <div className="flex flex-col flex-1 h-full" >
       <div className="flex-1">
         {/* Search */}
      <input
        type="text"
        placeholder={t("admin.doctors.searchPlaceholder")}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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
              onChange={() => { setFilter(item.value); setCurrentPage(1); }}
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
        ) : paginated.length > 0 ? (
          paginated.map((doctor) => (
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