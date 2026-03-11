import { useEffect, useMemo, useState } from "react";
import Pagination from "../components/Pagination";
import DoctorModal from "../components/DoctorModal";
import DoctorCard from "../components/AdminDoctorCard";
import { useDoctors } from "../context/doctorContext";
import { useTranslation } from "react-i18next";


const AdminDoctors = () => {
 
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [filter, setFilter] = useState("Approved");
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { doctors, updateStatus, banDoctor } = useDoctors();
  const [currentPage, setCurrentPage] = useState(1);
  

const filtered = doctors.filter((d) => {
  if (d.status === "Banned") return false;
  const matchesFilter = filter === "All" || d.status === filter;
  const doctorName = i18n.language === "ar" ? d.name_ar : d.name_en;
  const matchesSearch = doctorName.toLowerCase().includes(search.toLowerCase());
  return matchesFilter && matchesSearch;
});
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
 const filterOptions = [
  { value: "Approved", label: t("admin.doctors.approvedFilter") },
  { value: "Rejected", label: t("admin.doctors.rejectedFilter") },
  { value: "Pending",  label: t("admin.doctors.pendingFilter") },
];
  useMemo(() => {
      setCurrentPage(1);
    }, [filter, search, selectedDoctor]);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    
useEffect(() => {
  console.log(doctors);
}, [doctors]);
  

  return (
    <div className="flex flex-col flex-1" >
       <div className="flex-1">
         {/* Search */}
      <input
        type="text"
        placeholder={t("admin.doctors.searchPlaceholder")}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        className="w-full border dark:text-white border-white dark:border-[#334155]  rounded-lg px-4 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100 dark:bg-[#3341554D]"
      />

      {/* Filter Radio */}
      <div className="grid grid-cols-3 gap-3 cursor-pointer mb-6  text-sm text-gray-700  dark:text-white ">
        {filterOptions.map((item) => (
          <label key={item.value} className="flex items-center justify-between bg-gray-100 py-2 px-1 rounded-lg dark:bg-[#3341554D]">
             {`${item.label}`}
            <input
              type="radio"
              name="filter"
              value={item.value}
              checked={filter === item.value}
              onChange={() => { setFilter(item.value); setCurrentPage(1); }}
              className="accent-black w-4 h-4 dark:accent-white "
            />
           
          </label>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {paginated.length > 0 ? (
          paginated.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onClick={setSelectedDoctor} />
          ))
        ) : (
          <p className="text-gray-400 text-sm col-span-2 text-center py-10">No doctors found.</p>
        )}
      </div>
       </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
     
      {/* Modal */}
      <DoctorModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onApprove={(d) => updateStatus(d, "Approved")}
        onReject={(d) => updateStatus(d, "Rejected")}
        onBan={banDoctor}
      />
      
    </div>
  );
};

export default AdminDoctors;