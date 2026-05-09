import { useState, useEffect } from "react";
import { useDoctors } from "../context/doctorContext";
import { useTranslation } from "react-i18next";

export const useAdminDoctors = (itemsPerPage = 6) => {
  const [filter, setFilter] = useState("Approved");
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { doctors, totalCount, fetchDoctors, loading, updateStatus, banDoctor, unbanDoctor } = useDoctors();
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchDoctors({
      Status: filter,
      Search: search,
      PageNumber: currentPage,
      PageSize: itemsPerPage
    });
  }, [filter, search, currentPage, i18n.language]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  return {
    filter,
    search,
    selectedDoctor,
    setSelectedDoctor,
    doctors,
    totalCount,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    updateStatus,
    banDoctor,
    unbanDoctor
  };
};
