import { useState, useEffect } from "react";
import { getDoctorProfile, updateDoctorProfile, uploadDoctorImage } from "../modules/doctor/api/profileDoctorApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useDoctorProfile = () => {
  const { t } = useTranslation();
  const { fetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    id: "",
    firstNameEn: "",
    firstNameAr: "",
    lastNameEn: "",
    lastNameAr: "",
    email: "",
    phoneNumber: "",
    specializationEn: "",
    specializationAr: "",
    addressDescriptionEn: "",
    addressDescriptionAr: "",
    bioEn: "",
    bioAr: "",
    price: 0,
    imageUrl: "",
    rating: 0,
    reviewsCount: 0,
    patientsCount: 0,
    yearsOfExperience: 0,
    reviews: [],
    location: "",
    fullLocation: "",
    latitude: null,
    longitude: null,
    careerStartDate: ""
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getDoctorProfile();
      const formatAddressPart = (part) => (!part || part === "UnKnown") ? "" : part;
      const street = formatAddressPart(data.address?.street);
      const city = formatAddressPart(data.address?.city);
      const state = formatAddressPart(data.address?.state);

      setForm({
        ...data,
        id: data.id,
        firstNameEn: data.firstNameEn || "",
        firstNameAr: data.firstNameAr || "",
        lastNameEn: data.lastNameEn || "",
        lastNameAr: data.lastNameAr || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        specializationEn: data.specializationEn || "",
        specializationAr: data.specializationAr || "",
        addressDescriptionEn: data.addressDescriptionEn || "",
        addressDescriptionAr: data.addressDescriptionAr || "",
        bioEn: data.bioEn || "",
        bioAr: data.bioAr || "",
        price: data.price || 0,
        imageUrl: data.imageUrl || "",
        rating: data.rating || 0,
        reviewsCount: data.reviewsCount || 0,
        patientsCount: data.patientsCount || 0,
        yearsOfExperience: data.yearsOfExperience || 0,
        reviews: data.reviews || [],
        location: city,
        fullLocation: [street, city, state].filter(Boolean).join(", "),
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        careerStartDate: data.careerStartDate || data.CareerStartDate || ""
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      toast.error(t("profile.loadError") || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateDto = {
        firstNameEn: form.firstNameEn,
        firstNameAr: form.firstNameAr,
        lastNameEn: form.lastNameEn,
        lastNameAr: form.lastNameAr,
        phoneNumber: form.phoneNumber,
        addressDescriptionEn: form.addressDescriptionEn,
        addressDescriptionAr: form.addressDescriptionAr,
        bioEn: form.bioEn,
        bioAr: form.bioAr,
        price: Number(form.price) || 0,
        careerStartDate: form.careerStartDate || null
      };
      await updateDoctorProfile(updateDto);
      toast.success(t("profile.updatedSuccess") || "Profile updated successfully");
      setIsEditing(false);
      await fetchUser();
      await loadProfile();
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error(t("profile.saveError") || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await uploadDoctorImage(file);
      setForm(prev => ({ ...prev, imageUrl: res.imageUrl }));
      toast.success(t("profile.imageUpdated") || "Image updated successfully");
      await fetchUser();
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error(t("profile.imageUploadError") || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    form,
    isEditing,
    setIsEditing,
    loading,
    saving,
    uploadingImage,
    handleSave,
    handleImageUpload,
    handleChange,
    loadProfile
  };
};
