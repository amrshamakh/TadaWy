import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiEdit2, FiCheck } from "react-icons/fi";
import { UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getDoctorProfile,
  updateDoctorProfile,
  uploadDoctorImage,
} from "../../modules/doctor/api/profileDoctorApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Field = ({
  label,
  value,
  disabled,
  onChange,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="space-y-2">
      <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={[
          "w-full rounded-[22px] border px-4 py-3 text-sm outline-none transition-colors",
          disabled
            ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#1E293B] dark:text-white dark:border-[#334155]"
            : "bg-white border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:bg-[#0B1220] dark:text-slate-400 dark:border-[#1E293B] dark:focus:ring-teal-900/30",
        ].join(" ")}
      />
    </div>
  );
};

const DoctorProfile = () => {
  const { t, i18n } = useTranslation();
  const { user, fetchUser } = useAuth();
  const isRtl = i18n.language === "ar";
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    specialization: "",
    addressDescription: "",
    bio: "",
    price: "",
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
  });


  const disabled = !isEditing;


  const localizedFirstName = isRtl
    ? t(`doctorDashboard.profile.nameMap.${form.firstName}`, { defaultValue: form.firstName })
    : form.firstName;
  const localizedLastName = isRtl
    ? t(`doctorDashboard.profile.nameMap.${form.lastName}`, { defaultValue: form.lastName })
    : form.lastName;
  const doctorNameOnly = `${localizedFirstName} ${localizedLastName}`.replace(/\s+/g, " ").trim();
  const doctorDisplayName = `${isRtl ? "د." : "Dr."} ${doctorNameOnly}`.replace(/\s+/g, " ").trim();
  const doctorIdText = `${t("doctorDashboard.profile.id")}:${form.id || "..."}`;
  const localizedSpecialty =
    t(`discover.specialties.${form.specialization}`, { defaultValue: form.specialization }) || form.specialization;

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getDoctorProfile();
        const formatAddressPart = (part) => (!part || part === "UnKnown") ? "" : part;
        const street = formatAddressPart(data.address?.street);
        const city = formatAddressPart(data.address?.city);
        const state = formatAddressPart(data.address?.state);

        setForm({
          ...form,
          id: data.id,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          specialization: data.specialization || "",
          addressDescription: data.addressDescription || "",
          bio: data.bio || "",
          price: data.price || "",
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
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        addressDescription: form.addressDescription,
        bio: form.bio,
        price: Number(form.price) || 0,
      };
      await updateDoctorProfile(updateDto);
      toast.success(t("profile.updatedSuccess") || "Profile updated successfully");
      setIsEditing(false);
      await fetchUser(); // Refresh global auth state
      await loadProfile(); // Refresh local state
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error(t("profile.saveError") || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
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

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -mx-4 sm:-mx-6 -my-4 sm:-my-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-[calc(100vh-64px)] py-6 sm:py-8">
      <div className="max-w-[980px] mx-auto px-4 sm:px-0">
        <div className="rounded-3xl border border-slate-200 bg-white dark:bg-[#1E293B] dark:border-[#334155] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="relative bg-teal-500 h-[124px] sm:h-[140px]">
            {/* Avatar overlapping boundary */}
            <div className={`absolute top-full -translate-y-1/2 ${isRtl ? "right-6 sm:right-10" : "left-6 sm:left-10"}`}>
              <div className="group relative w-[140px] h-[140px] sm:w-[156px] sm:h-[156px] rounded-2xl bg-white dark:bg-[#1E293B] border-[3px] border-[#00BBA7] shadow-md flex items-center justify-center overflow-hidden">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-[110px] h-[110px] sm:w-[124px] sm:h-[124px] stroke-1 drop-shadow-sm text-[#00BBA7]" />
                )}
                
                {/* Image Upload Overlay */}
                {!disabled && (
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                    ) : (
                      <>
                        <FiEdit2 className="text-white mb-1" size={24} />
                        <span className="text-white text-xs font-medium">{t("profile.changePhoto", "Change Photo")}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Name + badge (right of avatar) */}
            <div className="h-full px-6 sm:px-10">
              <div className="h-full flex items-end pb-4">
                <div className={isRtl ? "pr-[158px] sm:pr-[180px]" : "pl-[158px] sm:pl-[180px]"}>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white leading-snug">
                      {doctorDisplayName}
                    </h2>
                    <span className="inline-flex items-center rounded-xl bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#00BBA7]">
                      {t("doctorDashboard.profile.verified")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-10 pb-10 pt-3 sm:pt-4">
            <div className="flex items-start justify-between gap-4 -translate-y-1 sm:-translate-y-2">
              <div className={`${isRtl ? "pr-[158px] sm:pr-[180px] text-right" : "pl-[158px] sm:pl-[180px] text-left"}`}>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-0.5 mt-0">
                  <div>{localizedSpecialty}</div>
                  <div>{doctorIdText}</div>
                </div>
              </div>

              <button
                onClick={handleEditToggle}
                disabled={saving}
                className={`
                  self-center sm:self-start
                  px-5 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer
                  ${isEditing 
                    ? "bg-[#00BBA7] text-white border border-[#00BBA7] hover:bg-teal-600 dark:hover:bg-teal-500" 
                    : "border border-[#00BBA7] text-[#00BBA7] bg-white hover:bg-teal-50 dark:bg-transparent dark:text-[#00BBA7] dark:border-[#00BBA7] dark:hover:bg-teal-950/30"
                  }
                  ${saving ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-current"></div>
                ) : isEditing ? (
                  <FiCheck size={18} />
                ) : (
                  <FiEdit2 size={16} />
                )}
                {saving
                  ? t("common.saving") || "Saving..."
                  : isEditing
                  ? t("doctorDashboard.profile.save")
                  : t("doctorDashboard.profile.edit")}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 sm:mt-14">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:bg-[#0F172A] dark:border-[#1E293B] shadow-sm">
                <div className="flex items-stretch justify-between px-6 sm:px-10 py-4">
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FaStar className="text-amber-400" size={20} />
                      <span className="font-semibold text-amber-400 text-[1.05rem] sm:text-lg">
                        {form.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {form.reviewsCount} {t("doctorDashboard.profile.reviews")}
                    </div>
                  </div>

                  <div className="w-px bg-slate-200 dark:bg-[#1E293B] h-10 self-center" />

                  <div className="flex-1 text-center">
                    <div className="font-semibold text-slate-800 dark:text-white text-[1.05rem] sm:text-lg">
                      {form.patientsCount}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t("doctorDashboard.profile.patients")}
                    </div>
                  </div>

                  <div className="w-px bg-slate-200 dark:bg-[#1E293B] h-10 self-center" />

                  <div className="flex-1 text-center">
                    <div className="font-semibold text-slate-800 dark:text-white text-[1.02rem] sm:text-[1.05rem]">
                      {form.yearsOfExperience} {t("doctorDashboard.profile.experience")}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t("doctorDashboard.profile.experienceSubtitle", { count: form.yearsOfExperience })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

              {/* ── Editable fields ── */}
              <Field
                label={t("doctorDashboard.profile.firstName")}
                value={form.firstName}
                disabled={disabled}
                onChange={(v) => setForm({ ...form, firstName: v })}
              />
              <Field
                label={t("doctorDashboard.profile.lastName")}
                value={form.lastName}
                disabled={disabled}
                onChange={(v) => setForm({ ...form, lastName: v })}
              />
              <Field
                label={t("doctorDashboard.profile.telephone")}
                value={form.phoneNumber}
                disabled={disabled}
                onChange={(v) => setForm({ ...form, phoneNumber: v })}
              />
              <Field
                label={t("doctorDashboard.profile.price", "Consultation Price")}
                value={form.price}
                disabled={disabled}
                onChange={(v) => setForm({ ...form, price: v })}
                type="number"
              />
              <Field
                label={t("doctorDashboard.profile.locationDetails", "Clinic Address")}
                value={form.addressDescription}
                disabled={disabled}
                onChange={(v) => setForm({ ...form, addressDescription: v })}
              />

              {/* ── Bio (full width) ── */}
              <div className="md:col-span-2 space-y-2">
                <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("doctorDashboard.profile.about")}
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  disabled={disabled}
                  rows={5}
                  className={[
                    "w-full rounded-[22px] border px-4 py-3 text-sm outline-none transition-colors resize-none",
                    disabled
                      ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#1E293B] dark:text-white dark:border-[#334155]"
                      : "bg-white border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:bg-[#0B1220] dark:text-slate-400 dark:border-[#1E293B] dark:focus:ring-teal-900/30",
                  ].join(" ")}
                />
              </div>

              {/* ── Read-only fields ── */}
              <Field
                label={t("doctorDashboard.profile.fullAddress", "Full Address")}
                value={form.fullLocation}
                disabled={true}
                onChange={() => {}}
              />
              <Field
                label={t("doctorDashboard.profile.email")}
                value={form.email}
                disabled={true}
                onChange={() => {}}
                type="email"
              />
              <Field
                label={t("doctorDashboard.profile.specialty")}
                value={form.specialization}
                disabled={true}
                onChange={() => {}}
              />
            </div>
            {/* Reviews */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("doctorDashboard.profile.reviews")} ({form.reviewsCount})
              </h3>

              <div className="mt-5 space-y-4">
                {form.reviews.length > 0 ? (
                  form.reviews.map((r, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-slate-100 dark:bg-[#0F172A] dark:border-[#1E293B] shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[1.02rem] font-bold text-slate-800 dark:text-white">
                            {r.patientName || r.PatientName || "Patient"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {r.date || r.Date || ""}
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-teal-100 text-teal-700 px-3 py-1 text-sm font-semibold dark:bg-teal-950/30 dark:text-teal-200">
                          <FaStar className="text-amber-400" />
                          {(r.rating ?? r.Rating ?? 0).toFixed(1)}
                        </div>
                      </div>
                      <p className="mt-3 text-[0.95rem] text-slate-500 dark:text-slate-300 leading-relaxed font-medium">
                        {r.comment || r.Comment || ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-10 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-dashed border-slate-300 dark:border-[#1E293B]">
                    {t("booking.reviewsSection.noReviews") || "No reviews available yet."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;