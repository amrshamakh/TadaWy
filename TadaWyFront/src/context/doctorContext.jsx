import { createContext, useContext, useState } from "react";
import i18n from "../i18n"; // adjust path to your i18n config

const mockDoctors = [
  {
    id: "123123",
    name_en: "Dr. Ahmed Ali",
    name_ar: "د. أحمد علي",
    createdAt: "00/00/0000",
    specialization_ar: "جراحة القلب",
    specialization_en: "Heart Surgery",
    status: "Approved",
    phone: "123456651132",
    email: "ahmed@gmail.com",
    clinicLocation_en: "Cairo, Egypt",
    clinicLocation_ar: "القاهرة، مصر",
    clinicDetails_en: "Floor 3, Building 5",
    clinicDetails_ar: "الطابق 3، المبنى 5",
    cv: "ahmed_cv.pdf",
    banReason: "",
  },
  {
    id: "323145",
    name_en: "Dr. Mohamed Hassan",
    name_ar: "د. محمد حسن",
    createdAt: "00/00/0000",
    specialization_ar: "جراحة العيون",
    specialization_en: "Eye Surgery",
    status: "Approved",
    phone: "123456651132",
    email: "mohamed@gmail.com",
    clinicLocation_en: "Giza, Egypt",
    clinicLocation_ar: "الجيزة، مصر",
    clinicDetails_en: "Floor 1, Building 2",
    clinicDetails_ar: "الطابق 1، المبنى 2",
    cv: "mohamed_cv.pdf",
    banReason: "",
  },
  {
    id: "1234",
    name_en: "Dr. Khalid",
    name_ar: "د. خالد",
    createdAt: "00/00/0000",
    specialization_ar: "جراحة الأعصاب",
    specialization_en: "Neuro Surgery",
    status: "Rejected",
    phone: "123456651132",
    email: "khalid@gmail.com",
    clinicLocation_en: "Alexandria, Egypt",
    clinicLocation_ar: "الإسكندرية، مصر",
    clinicDetails_en: "Floor 2, Building 8",
    clinicDetails_ar: "الطابق 2، المبنى 8",
    cv: "khalid_cv.pdf",
    banReason: "",
  },
  {
    id: "231234",
    name_en: "Dr. Tawfik",
    name_ar: "د. توفيق",
    createdAt: "00/00/0000",
    specialization_ar: "جراحة الأعصاب",
    specialization_en: "Neuro Surgery",
    status: "Pending",
    phone: "123456651132",
    email: "tawfik@gmail.com",
    clinicLocation_en: "Luxor, Egypt",
    clinicLocation_ar: "الأقصر، مصر",
    clinicDetails_en: "Floor 4, Building 3",
    clinicDetails_ar: "الطابق 4، المبنى 3",
    cv: "tawfik_cv.pdf",
    banReason: "",
  },
  {
    id: "1234-2",
    name_en: "Dr. Maram",
    name_ar: "د. مرام",
    createdAt: "00/00/0000",
    specialization_ar: "جراحة الأعصاب",
    specialization_en: "Neuro Surgery",
    status: "Rejected",
    phone: "123456651132",
    email: "maram@gmail.com",
    clinicLocation_en: "Aswan, Egypt",
    clinicLocation_ar: "أسوان، مصر",
    clinicDetails_en: "Floor 5, Building 1",
    clinicDetails_ar: "الطابق 5، المبنى 1",
    cv: "maram_cv.pdf",
    banReason: "",
  },
  {
    id: "323145-2",
    name_en: "Dr. Maiada",
    name_ar: " د. مياده",
    createdAt: "00/00/0000",
    specialization_ar: "جراحة الأعصاب",
    specialization_en: "Neuro Surgery",
    status: "Approved",
    phone: "123456651132",
    email: "maiada@gmail.com",
    clinicLocation_en: "Suez, Egypt",
    clinicLocation_ar: "السويس، مصر",
    clinicDetails_en: "Floor 6, Building 7",
    clinicDetails_ar: "الطابق 6، المبنى 7",
    cv: "maiada_cv.pdf",
    banReason: "",
  },
  {
    id: "231234-2",
    name_en: "Dr. Menna",
    name_ar: "د. منة",
    createdAt: "00/00/0000",
     specialization_ar: "جراحة الأعصاب",
    specialization_en: "Neuro Surgery",
    status: "Pending",
    phone: "123456651132",
    email: "menna@gmail.com",
    clinicLocation_en: "Mansoura, Egypt",
    clinicLocation_ar: "المنصورة، مصر",
    clinicDetails_en: "Floor 2, Building 4",
    clinicDetails_ar: "الطابق 2، المبنى 4",
    cv: "menna_cv.pdf",
    banReason: "",
  },
  {
    id: "323145-3",
    name_en: "Dr. Mahmoud",
    name_ar: "د. محمود",
    createdAt: "00/00/0000",
     specialization_ar: "جراحة الأعصاب",
    specialization_en: "Neuro Surgery",
    status: "Approved",
    phone: "123456651132",
    email: "mahmoud@gmail.com",
    clinicLocation_en: "Tanta, Egypt",
    clinicLocation_ar: "طنطا، مصر",
    clinicDetails_en: "Floor 3, Building 9",
    clinicDetails_ar: "الطابق 3، المبنى 9",
    cv: "mahmoud_cv.pdf",
    banReason: "",
  },
];

const DoctorsContext = createContext(null);

export function DoctorsProvider({ children }) {
  const [doctors, setDoctors] = useState(mockDoctors);

  const updateStatus = (doctor, newStatus) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, status: newStatus } : d))
    );
  };

  const banDoctor = (doctor, reason = "") => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctor.id
          ? { ...d, status: "Banned", banReason: reason.trim() }
          : d
      )
    );
    alert(i18n.t("admin.doctorContext.banAlert", { name: doctor.name_en || doctor.name_ar || doctor.id }));
  };

  const unbanDoctor = (doctor) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, status: "Pending", banReason: "" } : d))
    );
  };

  return (
    <DoctorsContext.Provider value={{ doctors, updateStatus, banDoctor, unbanDoctor }}>
      {children}
    </DoctorsContext.Provider>
  );
}

export function useDoctors() {
  return useContext(DoctorsContext);
}