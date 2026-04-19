import { useCallback, useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiChevronDown, FiEdit2, FiCheck } from "react-icons/fi";
import { MapPin, Crosshair, UserIcon, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  getDoctorProfile,
  updateDoctorProfile,
  uploadDoctorImage,
} from "../../modules/doctor/api/profileDoctorApi";

/* Fix Leaflet marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FlyTo = ({ position }) => {
  const map = useMap();
  map.setView(position, 13);
  return null;
};

function LocationPicker({ position, disabled, onPick }) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      const { lat, lng } = e.latlng;
      onPick(lat, lng);
    },
  });
  return <Marker position={position} />;
}

const Field = ({
  label,
  value,
  disabled,
  onChange,
  type = "text",
  placeholder,
  as = "input",
  options = [],
}) => {
  return (
    <div className="space-y-2">
      <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {as === "select" ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={[
              "w-full appearance-none rounded-[22px] border px-4 py-3 pr-11 text-sm outline-none transition-colors",
              disabled
                ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#1E293B] dark:text-white dark:border-[#334155]"
                : "bg-white border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:bg-[#0B1220] dark:text-slate-400 dark:border-[#1E293B] dark:focus:ring-teal-900/30",
            ].join(" ")}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <FiChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      ) : (
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
      )}
    </div>
  );
};

const normalizeProfile = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id ?? raw.Id,
    firstName: raw.firstName ?? raw.FirstName ?? "",
    lastName: raw.lastName ?? raw.LastName ?? "",
    email: raw.email ?? raw.Email ?? "",
    phoneNumber: raw.phoneNumber ?? raw.PhoneNumber ?? "",
    specialization: raw.specialization ?? raw.Specialization ?? "",
    addressDescription: raw.addressDescription ?? raw.AddressDescription ?? "",
    address: raw.address ?? raw.Address ?? "",
    bio: raw.bio ?? raw.Bio ?? "",
    price: raw.price ?? raw.Price ?? null,
    careerStartDate: raw.careerStartDate ?? raw.CareerStartDate ?? null,
    imageUrl: raw.imageUrl ?? raw.ImageUrl ?? null,
    latitude: raw.latitude ?? raw.Latitude ?? null,
    longitude: raw.longitude ?? raw.Longitude ?? null,
    rating: raw.rating ?? raw.Rating ?? 0,
    reviewsCount: raw.reviewsCount ?? raw.ReviewsCount ?? 0,
    patientsCount: raw.patientsCount ?? raw.PatientsCount ?? 0,
    yearsOfExperience: raw.yearsOfExperience ?? raw.YearsOfExperience ?? 0,
    reviews: raw.reviews ?? raw.Reviews ?? [],
  };
};

const DoctorProfile = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const LOCATION_STORAGE_KEY = "doctor_location";

  const storedLocation = JSON.parse(
    localStorage.getItem(LOCATION_STORAGE_KEY) || "{}",
  );

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    specialty: "",
    location: storedLocation?.location || "",
    locationDetails: "",
    email: "",
    about: "",
    fullLocation: storedLocation?.fullLocation || "",
    latitude: storedLocation?.latitude ?? null,
    longitude: storedLocation?.longitude ?? null,
    price: "",
  });

  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(
    storedLocation?.latitude && storedLocation?.longitude
      ? [storedLocation.latitude, storedLocation.longitude]
      : [30.0444, 31.2357],
  );

  const applyProfileToForm = useCallback((p) => {
    const n = normalizeProfile(p);
    if (!n) return;
    setForm((prev) => ({
      ...prev,
      firstName: n.firstName,
      lastName: n.lastName,
      telephone: n.phoneNumber,
      email: n.email,
      specialty: n.specialization,
      about: n.bio || "",
      locationDetails: n.addressDescription || "",
      price: n.price != null ? String(n.price) : "",
      latitude: n.latitude ?? prev.latitude,
      longitude: n.longitude ?? prev.longitude,
    }));
    if (n.latitude != null && n.longitude != null) {
      setPosition([n.latitude, n.longitude]);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await getDoctorProfile();
      const n = normalizeProfile(raw);
      setProfile(n);
      applyProfileToForm(raw);
    } catch (e) {
      console.error(e);
      alert(t("doctorDashboard.profile.loadError", "Could not load profile"));
    } finally {
      setLoading(false);
    }
  }, [applyProfileToForm, t]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const disabled = !isEditing;

  const localizedFirstName = isRtl
    ? t(`doctorDashboard.profile.nameMap.${form.firstName}`, {
        defaultValue: form.firstName,
      })
    : form.firstName;
  const localizedLastName = isRtl
    ? t(`doctorDashboard.profile.nameMap.${form.lastName}`, {
        defaultValue: form.lastName,
      })
    : form.lastName;
  const doctorNameOnly = `${localizedFirstName} ${localizedLastName}`
    .replace(/\s+/g, " ")
    .trim();
  const doctorDisplayName = `${isRtl ? "د." : "Dr."} ${doctorNameOnly}`
    .replace(/\s+/g, " ")
    .trim();
  const doctorIdLabel = profile?.id
    ? `${t("doctorDashboard.profile.id")}:${profile.id}`
    : "";
  const localizedSpecialty =
    t(`discover.specialties.${form.specialty}`, {
      defaultValue: form.specialty,
    }) || form.specialty;

  const displayImageSrc =
    imagePreview ||
    profile?.imageUrl ||
    null;

  const reviewsList = useMemo(() => {
    const list = profile?.reviews;
    if (!Array.isArray(list) || list.length === 0) return [];
    return list.map((r, idx) => ({
      id: idx + 1,
      rating: Number(r.rating ?? r.Rating ?? 0),
      name: t("doctorDashboard.profile.anonymousPatient", "Patient"),
      date: "",
      text: r.comment ?? r.Comment ?? "",
    }));
  }, [profile?.reviews, t]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "User-Agent": "tadawy-app" } },
      );
      const result = await res.json();
      const city =
        result.address.city ||
        result.address.town ||
        result.address.village ||
        "";

      const locationData = {
        location: city,
        fullLocation: result.display_name,
        latitude: lat,
        longitude: lng,
      };

      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));

      setForm((prev) => ({
        ...prev,
        location: city,
        fullLocation: result.display_name,
        latitude: lat,
        longitude: lng,
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
      alert(t("doctorDashboard.profile.locationFetchError"));
    }
  };

  const onMapPick = async (lat, lng) => {
    setPosition([lat, lng]);
    await reverseGeocode(lat, lng);
    setShowMap(false);
  };

  const getCurrentLocation = () => {
    if (disabled) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        await reverseGeocode(lat, lng);
        setShowMap(false);
      },
      () => alert(t("doctorDashboard.profile.locationPermissionDenied")),
    );
  };

  const handleOpenMap = () => {
    if (disabled) return;
    if (!position) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition([30.0444, 31.2357]),
      );
    }
    setShowMap(true);
  };

  const persistProfile = async () => {
    setSaveLoading(true);
    try {
      const priceVal =
        form.price === "" || form.price == null
          ? null
          : Number(form.price);
      await updateDoctorProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.telephone,
        addressDescription: form.locationDetails,
        bio: form.about,
        price: Number.isFinite(priceVal) ? priceVal : null,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      if (pendingImage) {
        const res = await uploadDoctorImage(pendingImage);
        const url = res?.imageUrl ?? res?.ImageUrl;
        if (url) setProfile((p) => (p ? { ...p, imageUrl: url } : p));
        setPendingImage(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      await loadProfile();
      setIsEditing(false);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Save failed";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    await persistProfile();
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPendingImage(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500">
        {t("common.loading", "Loading…")}
      </div>
    );
  }

  return (
    <div className="w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -mx-4 sm:-mx-6 -my-4 sm:-my-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-[calc(100vh-64px)] py-6 sm:py-8">
      <div className="max-w-[980px] mx-auto px-4 sm:px-0">
        <div className="rounded-3xl border border-slate-200 bg-white dark:bg-[#1E293B] dark:border-[#334155] shadow-sm overflow-hidden">
          <div className="relative bg-teal-500 h-[124px] sm:h-[140px]">
            <div
              className={`absolute top-full -translate-y-1/2 ${isRtl ? "right-6 sm:right-10" : "left-6 sm:left-10"}`}
            >
              <div className="relative w-[140px] h-[140px] sm:w-[156px] sm:h-[156px] rounded-2xl bg-white dark:bg-[#1E293B] border-[3px] border-[#00BBA7] shadow-md flex items-center justify-center overflow-hidden">
                {displayImageSrc ? (
                  <img
                    src={displayImageSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-[110px] h-[110px] sm:w-[124px] sm:h-[124px] stroke-1 drop-shadow-sm text-[#00BBA7]" />
                )}
                {isEditing && (
                  <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-white/90 p-2 shadow dark:bg-slate-800">
                    <Camera className="w-4 h-4 text-teal-600" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="h-full px-6 sm:px-10">
              <div className="h-full flex items-end pb-4">
                <div
                  className={
                    isRtl ? "pr-[158px] sm:pr-[180px]" : "pl-[158px] sm:pl-[180px]"
                  }
                >
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

          <div className="px-6 sm:px-10 pb-10 pt-3 sm:pt-4">
            <div className="flex items-start justify-between gap-4 -translate-y-1 sm:-translate-y-2">
              <div
                className={`${isRtl ? "pr-[158px] sm:pr-[180px] text-right" : "pl-[158px] sm:pl-[180px] text-left"}`}
              >
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-0.5 mt-0">
                  <div>{localizedSpecialty}</div>
                  <div>{doctorIdLabel}</div>
                </div>
              </div>

              <button
                type="button"
                disabled={saveLoading}
                onClick={() => void handleEditToggle()}
                className={`
                  self-center sm:self-start
                  px-5 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer
                  disabled:opacity-60
                  ${isEditing
                    ? "bg-[#00BBA7] text-white border border-[#00BBA7] hover:bg-teal-600 dark:hover:bg-teal-500"
                    : "border border-[#00BBA7] text-[#00BBA7] bg-white hover:bg-teal-50 dark:bg-transparent dark:text-[#00BBA7] dark:border-[#00BBA7] dark:hover:bg-teal-950/30"
                  }
                `}
              >
                {isEditing ? <FiCheck size={18} /> : <FiEdit2 size={16} />}
                {saveLoading
                  ? t("common.saving", "Saving…")
                  : isEditing
                    ? t("doctorDashboard.profile.save")
                    : t("doctorDashboard.profile.edit")}
              </button>
            </div>

            <div className="mt-10 sm:mt-14">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:bg-[#0F172A] dark:border-[#1E293B] shadow-sm">
                <div className="flex items-stretch justify-between px-6 sm:px-10 py-4">
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FaStar className="text-amber-400" size={20} />
                      <span className="font-semibold text-amber-400 text-[1.05rem] sm:text-lg">
                        {(profile?.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {profile?.reviewsCount ?? 0}{" "}
                      {t("doctorDashboard.profile.reviews")}
                    </div>
                  </div>

                  <div className="w-px bg-slate-200 dark:bg-[#1E293B] h-10 self-center" />

                  <div className="flex-1 text-center">
                    <div className="font-semibold text-slate-800 dark:text-white text-[1.05rem] sm:text-lg">
                      {profile?.patientsCount ?? 0}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t("doctorDashboard.profile.patients")}
                    </div>
                  </div>

                  <div className="w-px bg-slate-200 dark:bg-[#1E293B] h-10 self-center" />

                  <div className="flex-1 text-center">
                    <div className="font-semibold text-slate-800 dark:text-white text-[1.02rem] sm:text-[1.05rem]">
                      {t("doctorDashboard.profile.experience")}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t("doctorDashboard.profile.experienceSubtitle", {
                        count: profile?.yearsOfExperience ?? 0,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <Field
                label={t("doctorDashboard.profile.firstName")}
                value={form.firstName}
                disabled={disabled}
                onChange={(v) => setForm((p) => ({ ...p, firstName: v }))}
              />
              <Field
                label={t("doctorDashboard.profile.lastName")}
                value={form.lastName}
                disabled={disabled}
                onChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
              />
              <Field
                label={t("doctorDashboard.profile.telephone")}
                value={form.telephone}
                disabled={disabled}
                onChange={(v) => setForm((p) => ({ ...p, telephone: v }))}
              />
              <div className="space-y-2">
                <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("doctorDashboard.profile.specialty")}
                </label>
                <input
                  type="text"
                  value={localizedSpecialty}
                  disabled
                  className="w-full rounded-[22px] border px-4 py-3 text-sm bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#1E293B] dark:text-white dark:border-[#334155]"
                />
              </div>
              <Field
                label={t("doctorDashboard.profile.consultationFee", "Consultation fee (EGP)")}
                value={form.price}
                disabled={disabled}
                onChange={(v) => setForm((p) => ({ ...p, price: v }))}
                type="number"
                placeholder="150"
              />
              <div className="space-y-2">
                <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("doctorDashboard.profile.location")}
                </label>
                <div
                  className={`relative ${!disabled ? "cursor-pointer" : ""}`}
                  onClick={() => {
                    if (!disabled) handleOpenMap();
                  }}
                >
                  <input
                    readOnly
                    type="text"
                    value={form.location || ""}
                    placeholder={t("doctorDashboard.profile.locationPlaceholder")}
                    className={[
                      "w-full rounded-[22px] border px-4 py-3 pr-10 text-sm outline-none transition-colors",
                      disabled
                        ? "bg-slate-50 text-slate-600 border-slate-200 cursor-not-allowed dark:bg-[#1E293B] dark:text-white dark:border-[#334155]"
                        : "bg-white border-slate-200 hover:border-teal-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:bg-[#0B1220] dark:text-slate-400 dark:border-[#1E293B] dark:focus:ring-teal-900/30 cursor-pointer pointer-events-none",
                    ].join(" ")}
                  />
                  <div
                    className={`absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center pointer-events-none transition-colors ${disabled ? "text-slate-400 dark:text-slate-500" : "text-teal-500 dark:text-[#00BBA7]"}`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <Field
                label={t("doctorDashboard.profile.locationDetails")}
                value={form.locationDetails}
                disabled={disabled}
                onChange={(v) => setForm((p) => ({ ...p, locationDetails: v }))}
              />
              <Field
                label={t("doctorDashboard.profile.email")}
                value={form.email}
                disabled
                onChange={() => {}}
                type="email"
              />

              <div className="md:col-span-2 space-y-2">
                <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t("doctorDashboard.profile.about")}
                </label>
                <textarea
                  value={form.about}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, about: e.target.value }))
                  }
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
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("doctorDashboard.profile.reviews")}
              </h3>

              <div className="mt-5 space-y-4">
                {reviewsList.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t(
                      "doctorDashboard.profile.noReviewsYet",
                      "No reviews yet. Reviews from patients will appear here.",
                    )}
                  </p>
                ) : (
                  reviewsList.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-slate-200 bg-slate-100 dark:bg-[#0F172A] dark:border-[#1E293B] shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[1.02rem] font-bold text-slate-800 dark:text-white">
                            {r.name}
                          </div>
                          {r.date ? (
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {r.date}
                            </div>
                          ) : null}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-teal-100 text-teal-700 px-3 py-1 text-sm font-semibold dark:bg-teal-950/30 dark:text-teal-200">
                          <FaStar className="text-amber-400" />
                          {r.rating.toFixed(1)}
                        </div>
                      </div>

                      {r.text ? (
                        <p className="mt-3 text-[0.95rem] text-slate-500 dark:text-slate-300 leading-relaxed font-medium">
                          {r.text}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl w-full max-w-3xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("doctorDashboard.profile.locationPlaceholder")}
            </h3>

            {!disabled && (
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full flex items-center justify-center gap-2 border-2 border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 py-2.5 rounded-lg transition font-medium"
              >
                <Crosshair size={20} />
                {t("auth.signup.useLocation")}
              </button>
            )}

            {position && (
              <MapContainer
                center={position}
                zoom={13}
                className="h-[400px] w-full rounded-lg relative z-0"
              >
                <FlyTo position={position} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker
                  position={position}
                  disabled={disabled}
                  onPick={onMapPick}
                />
              </MapContainer>
            )}

            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="w-full bg-gray-200 dark:bg-[#334155] hover:bg-gray-300 dark:hover:bg-[#475569] text-gray-800 dark:text-white py-2.5 rounded-lg font-medium transition"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
