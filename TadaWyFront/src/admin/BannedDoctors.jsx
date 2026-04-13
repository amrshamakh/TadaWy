import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination";
import DoctorModal from "../components/DoctorModal";
import DoctorCard from "../components/AdminDoctorCard";
import { useDoctors } from "../context/doctorContext";
import { useLocalizedField } from "../hooks/useLocalizedField";

const BannedDoctors = () => {
  const { t } = useTranslation();
    const localize = useLocalizedField();
  const { doctors, banDoctor, unbanDoctor } = useDoctors();
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState("");

  const filtered = doctors.filter((d) => {
    if (d.status !== "Banned") return false;
    return localize(d, "name").toLowerCase().includes(search.toLowerCase());
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleUnban = (doctor) => {
    unbanDoctor(doctor);
    setSelectedDoctor(null);
  };

  useMemo(() => {
    setCurrentPage(1);
  }, [search, selectedDoctor]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col flex-1">
        <div className="flex-1">
           <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5">
          {t("admin.bannedDoctors.title")}
        </h2>

        <input
          type="text"
          placeholder={t("admin.bannedDoctors.searchPlaceholder")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full dark:text-white border border-white dark:border-[#334155] rounded-lg px-4 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100 dark:bg-[#3341554D]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {paginated.length > 0 ? (
            paginated.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} onClick={setSelectedDoctor} />
            ))
          ) : (
            <p className="text-gray-400 text-sm col-span-2 text-center py-10">
              {t("admin.bannedDoctors.empty")}
            </p>
          )}
        </div>
      </div>

          </div>
     
    
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      

      <DoctorModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onApprove={() => {}}
        onReject={() => {}}
        onBan={banDoctor}
        onUnban={handleUnban}
        onActionSuccess={(message) => {
          setToastMessage(message);
          setTimeout(() => setToastMessage(""), 2600);
        }}
      />
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[70] rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2 text-sm shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default BannedDoctors;