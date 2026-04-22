import { createContext, useContext, useState, useCallback } from "react";
import AdminApi from "../modules/admin/api/adminApi";

const DoctorsContext = createContext(null);

const STATUS_MAP = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
  3: "Banned",
};

const STATUS_REVERSE_MAP = {
  "Pending": 0,
  "Approved": 1,
  "Rejected": 2,
  "Banned": 3,
};

export function DoctorsProvider({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const mapDoctor = useCallback((d, specs = specializations) => {
    const sId = d.specializationId ?? d.SpecializationId;
    const spec = specs.find(s => s.id === sId || s.Id === sId);

    const addr = d.address || d.Address || {};
    const street = (addr.street || addr.Street || "").replace(/UnKnown/i, "").trim();
    const city = (addr.city || addr.City || "").replace(/UnKnown/i, "").trim();
    const state = (addr.state || addr.State || "").replace(/UnKnown/i, "").trim();
    const clinicLocation = [street, city, state].filter(Boolean).join(", ") || "—";

    return {
      ...d,
      id: (d.id ?? d.Id)?.toString(),
      name: d.doctorName || d.DoctorName || "", 
      status: STATUS_MAP[d.status ?? d.Status] || "Pending",
      createdAt: (d.createdAt || d.CreatedAt) ? new Date(d.createdAt || d.CreatedAt).toLocaleDateString() : "00/00/0000",
      specialization: spec ? (spec.name || spec.Name) : "—",
      clinicLocation
    };
  }, [specializations]);

  const fetchSpecializations = async () => {
    try {
        const data = await AdminApi.getSpecializations();
        setSpecializations(data);
        return data;
    } catch (err) {
        console.error("Failed to fetch specializations", err);
        return [];
    }
  };

  const fetchDoctors = async (params = {}) => {
    setLoading(true);
    try {
      let currentSpecs = specializations;
      if (currentSpecs.length === 0) {
          currentSpecs = await fetchSpecializations();
      }

      const apiParams = {
        ...params,
        Status: params.Status !== undefined ? STATUS_REVERSE_MAP[params.Status] : undefined,
      };
      const response = await AdminApi.getDoctors(apiParams);
      const data = response.items || response.Items || (Array.isArray(response) ? response : []);
      const count = response.totalCount || response.TotalCount || data.length;
      
      setDoctors(data.map(d => mapDoctor(d, currentSpecs)));
      setTotalCount(count);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorDetails = async (id) => {
    try {
      const data = await AdminApi.getDoctorById(id);
      let cvUrl = "";
      try {
        const cvResponse = await AdminApi.getDoctorCv(id);
        cvUrl = cvResponse.url || cvResponse.Url || "";
      } catch (err) {
        console.error("Failed to fetch doctor CV URL", err);
      }

      return {
        ...mapDoctor(data),
        phone: data.phoneNumber || data.PhoneNumber,
        email: data.email || data.Email,
        cv: (data.verificationDocumentPath || data.VerificationDocumentPath) 
          ? (data.verificationDocumentPath || data.VerificationDocumentPath).split("/").pop() 
          : "No file",
        cvUrl: cvUrl || (data.verificationDocumentPath || data.VerificationDocumentPath),
        clinicDetails: data.addressDescription || data.AddressDescription || "—",
        rejectionReason: data.rejectionReason || data.RejectionReason,
        bannedReason: data.bannedReason || data.BannedReason
      };
    } catch (err) {
      console.error("Failed to fetch doctor details", err);
      return null;
    }
  };

  const updateStatus = async (doctor, newStatus, reason = "") => {
    try {
      if (newStatus === "Approved") {
        await AdminApi.approveDoctor(doctor.id);
      } else if (newStatus === "Rejected") {
        await AdminApi.rejectDoctor(doctor.id, reason);
      }
      // Refresh current list after action
      await fetchDoctors();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const banDoctor = async (doctor, reason = "") => {
    try {
      await AdminApi.banDoctor(doctor.id, reason);
      await fetchDoctors();
    } catch (err) {
      console.error("Failed to ban doctor", err);
    }
  };

  const unbanDoctor = async (doctor) => {
    try {
      await AdminApi.unbanDoctor(doctor.id);
      await fetchDoctors();
    } catch (err) {
      console.error("Failed to unban doctor", err);
    }
  };

  return (
    <DoctorsContext.Provider 
      value={{ 
        doctors, 
        totalCount, 
        loading, 
        fetchDoctors, 
        getDoctorDetails,
        updateStatus, 
        banDoctor, 
        unbanDoctor 
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
}

export function useDoctors() {
  return useContext(DoctorsContext);
}