import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiChevronDown, FiEdit2 } from "react-icons/fi";
import { MapPin, Crosshair ,UserIcon} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";


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

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const LOCATION_STORAGE_KEY = "doctor_location";

  const storedLocation = JSON.parse(
    localStorage.getItem(LOCATION_STORAGE_KEY) || "{}"
  );

  const [form, setForm] = useState({
    firstName: "Ahmed",
    lastName: "Khaled",
    telephone: "01587823124",
    specialty: "Cardiology",
    location: storedLocation?.location || "",
    locationDetails: "",
    email: "ahmedkhaled@gmail.com",
    about: "",
    fullLocation: storedLocation?.fullLocation || "",
    latitude: storedLocation?.latitude || null,
    longitude: storedLocation?.longitude || null,
  });

  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(
    storedLocation?.latitude && storedLocation?.longitude
      ? [storedLocation.latitude, storedLocation.longitude]
      : [30.0444, 31.2357]
  );

  const specialtyOptions = useMemo(
    () => [
      "Cardiology",
      "Orthopedics",
      "Dentistry",
      "Ophthalmology",
      "Dermatology",
      "General Practice",
      "Pediatrics",
      "Gynecology",
      "Psychiatry",
      "Neurology",
      "Pulmonology",
      "Gastroenterology",
    ],
    []
  );

  const reviews = useMemo(
    () => [
      {
        id: 1,
        name: "John Smith",
        date: "February 15, 2020",
        rating: 4.5,
        text: "Excellent care and very professional staff. Dr. Johnson took the time to explain everything clearly.",
      },
      {
        id: 2,
        name: "Mary Davis",
        date: "February 10, 2020",
        rating: 4.5,
        text: "The best cardiologist I've ever visited. Highly recommend!",
      },
    ],
    []
  );

  const disabled = !isEditing;

  const doctorNameOnly = `${form.firstName} ${form.lastName}`.replace(/\s+/g, " ").trim();
  const doctorDisplayName = `Dr. ${doctorNameOnly}`.replace(/\s+/g, " ").trim();
  const doctorId = "ID:123231";

  useEffect(() => {
    try {
      const raw = localStorage.getItem("doctorProfile");
      if (!raw) return;
      const saved = JSON.parse(raw);
      setForm((p) => ({
        ...p,
        firstName: saved?.firstName ?? p.firstName,
        lastName: saved?.lastName ?? p.lastName,
        email: saved?.email ?? p.email,
        telephone: saved?.telephone ?? p.telephone,
        specialty: saved?.specialty ?? p.specialty,
        about: saved?.about ?? p.about,
      }));
    } catch {
      // ignore
    }
  }, []);

  const updateForm = (patch) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(
          "doctorProfile",
          JSON.stringify({
            firstName: next.firstName,
            lastName: next.lastName,
            telephone: next.telephone,
            specialty: next.specialty,
            email: next.email,
            about: next.about,
            displayName: `Dr. ${`${next.firstName} ${next.lastName}`.replace(/\s+/g, " ").trim()}`,
          })
        );
        window.dispatchEvent(new Event("doctorProfileUpdated"));
      } catch {
        // ignore
      }
      return next;
    });
  };

  /* Reverse Geocode */
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "User-Agent": "tadawy-app" } }
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
      alert("Failed to get location details");
    }
  };

  /* Click on map */
  function LocationPicker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (disabled) return;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        setShowMap(false);
      },
    });
    return <Marker position={position} />;
  }

  /* Current location */
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
      () => alert("Location permission denied")
    );
  };

  const handleOpenMap = () => {
    if (!position) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition([30.0444, 31.2357])
      );
    }
    setShowMap(true);
  };

  return (
    <div className="w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -mx-4 sm:-mx-6 -my-4 sm:-my-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-[calc(100vh-64px)] py-6 sm:py-8">
      <div className="max-w-[980px] mx-auto px-4 sm:px-0">
        <div className="rounded-3xl border border-slate-200 bg-white dark:bg-[#1E293B] dark:border-[#334155] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="relative bg-teal-500 h-[124px] sm:h-[140px]">
            {/* Avatar overlapping boundary */}
            <div className="absolute left-6 sm:left-10 top-full -translate-y-1/2">
            <div className="w-[140px] h-[140px] sm:w-[156px] sm:h-[156px] rounded-2xl bg-white dark:bg-[#1E293B] border-[3px] border-[#00BBA7] shadow-md flex items-center justify-center overflow-hidden">
                <UserIcon
                  
                  alt="Doctor"
                  className="w-[110px] h-[110px] sm:w-[124px] sm:h-[124px] stroke-1 drop-shadow-sm text-[#00BBA7]"
                />
              </div>
            </div>

            {/* Name + badge (right of avatar) */}
            <div className="h-full px-6 sm:px-10">
              <div className="h-full flex items-end pb-4">
                <div className="pl-[158px] sm:pl-[180px]">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white leading-snug">
                      {doctorDisplayName}
                    </h2>
                    <span className="inline-flex items-center rounded-xl bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#00BBA7]">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-10 pb-10 pt-3 sm:pt-4">
            <div className="flex items-start justify-between gap-4 -translate-y-1 sm:-translate-y-2">
              <div className="pl-[158px] sm:pl-[180px] text-left">
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-0.5 mt-0">
                  <div>{form.specialty}</div>
                  <div>{doctorId}</div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing((p) => !p)}
                className="
                  self-center sm:self-start
                  px-5 py-2.5 rounded-xl text-sm font-medium
                  border border-[#00BBA7] text-[#00BBA7] bg-white
                  hover:bg-teal-50 transition-colors
                  dark:bg-transparent dark:text-[#00BBA7] dark:border-[#00BBA7] dark:hover:bg-teal-950/30
                "
              >
                <span className="inline-flex items-center gap-2">
                  {!isEditing && <FiEdit2 className="text-[#00BBA7] dark:text-[#00BBA7]" />}
                  {isEditing ? "Save" : "Edit"}
                </span>
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
                        4.8
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      97 Reviews
                    </div>
                  </div>

                  <div className="w-px bg-slate-200 dark:bg-[#1E293B] h-10 self-center" />

                  <div className="flex-1 text-center">
                    <div className="font-semibold text-slate-800 dark:text-white text-[1.05rem] sm:text-lg">
                      157
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Patients
                    </div>
                  </div>

                  <div className="w-px bg-slate-200 dark:bg-[#1E293B] h-10 self-center" />

                  <div className="flex-1 text-center">
                    <div className="font-semibold text-slate-800 dark:text-white text-[1.02rem] sm:text-[1.05rem]">
                      Years of Experience
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      4 Years
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <Field
                label="First Name"
                value={form.firstName}
                disabled={disabled}
                onChange={(v) => updateForm({ firstName: v })}
              />
              <Field
                label="Last Name"
                value={form.lastName}
                disabled={disabled}
                onChange={(v) => updateForm({ lastName: v })}
              />
              <Field
                label="Telephone Number"
                value={form.telephone}
                disabled={disabled}
                onChange={(v) => updateForm({ telephone: v })}
              />
              <Field
                label="Specialty"
                value={form.specialty}
                disabled={disabled}
                onChange={(v) => updateForm({ specialty: v })}
                as="select"
                options={specialtyOptions}
              />
              {/* Location Input overriding generic Field to add Map modal support */}
              <div className="space-y-2">
                <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Location
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
                    placeholder="Select your location"
                    className={[
                      "w-full rounded-[22px] border px-4 py-3 pr-10 text-sm outline-none transition-colors",
                      disabled
                        ? "bg-slate-50 text-slate-600 border-slate-200 cursor-not-allowed dark:bg-[#1E293B] dark:text-white dark:border-[#334155]"
                        : "bg-white border-slate-200 hover:border-teal-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:bg-[#0B1220] dark:text-slate-400 dark:border-[#1E293B] dark:focus:ring-teal-900/30 cursor-pointer pointer-events-none",
                    ].join(" ")}
                  />
                  <div
                    className={`absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center pointer-events-none transition-colors ${disabled ? "text-teal-500 dark:text-[#00BBA7]" : "text-slate-400 border-slate-200"
                      }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <Field
                label="Location’s Details"
                value={form.locationDetails}
                disabled={disabled}
                onChange={(v) => setForm((p) => ({ ...p, locationDetails: v }))}
              />
              <Field
                label="Email Address"
                value={form.email}
                disabled={disabled}
                onChange={(v) => updateForm({ email: v })}
                type="email"
              />

              <div className="md:col-span-2 space-y-2">
                <label className="pl-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  About
                </label>
                <textarea
                  value={form.about}
                  onChange={(e) => updateForm({ about: e.target.value })}
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

            {/* Reviews */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Reviews
              </h3>

              <div className="mt-5 space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="
                      rounded-2xl border border-slate-200 bg-slate-100
                      dark:bg-[#0F172A] dark:border-[#1E293B]
                      shadow-sm p-5
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[1.02rem] font-bold text-slate-800 dark:text-white">
                          {r.name}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {r.date}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-teal-100 text-teal-700 px-3 py-1 text-sm font-semibold dark:bg-teal-950/30 dark:text-teal-200">
                        <FaStar className="text-amber-400" />
                        {r.rating.toFixed(1)}
                      </div>
                    </div>

                    <p className="mt-3 text-[0.95rem] text-slate-500 dark:text-slate-300 leading-relaxed font-medium">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAP MODAL */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl w-full max-w-3xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Select Your Location
            </h3>

            {/* Current Location Button */}
            {!disabled && (
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full flex items-center justify-center gap-2 border-2 border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 py-2.5 rounded-lg transition font-medium"
              >
                <Crosshair size={20} />
                Use Current Location
              </button>
            )}

            {/* Map */}
            {position && (
              <MapContainer
                center={position}
                zoom={13}
                className="h-[400px] w-full rounded-lg relative z-0"
              >
                <FlyTo position={position} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
              </MapContainer>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="w-full bg-gray-200 dark:bg-[#334155] hover:bg-gray-300 dark:hover:bg-[#475569] text-gray-800 dark:text-white py-2.5 rounded-lg font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;