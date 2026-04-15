import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Crosshair,
  Upload,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  Plus,
  X,
  Search
} from "lucide-react";
import { assets } from "../assets/assets";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getAllSpecializations } from "../modules/doctor/api/lookupApi";
import { registerDoctor } from "../modules/doctor/api/registerDoctorApi";

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

const DoctorApplication = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const LOCATION_STORAGE_KEY = "doctor_location";

  const storedLocation = JSON.parse(
    localStorage.getItem(LOCATION_STORAGE_KEY) || "{}",
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: storedLocation?.location || "",
    fullLocation: storedLocation?.fullLocation || "",
    latitude: storedLocation?.latitude || null,
    longitude: storedLocation?.longitude || null,
    addressDetails: "",
    specializationId: "",
    specializationName: "",
    careerStartDate: "",
    cv: null,
  });

  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSpecs, setShowSpecs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const specRef = useRef(null);

  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(
    storedLocation?.latitude && storedLocation?.longitude
      ? [storedLocation.latitude, storedLocation.longitude]
      : [30.0444, 31.2357],
  );

  useEffect(() => {
    const fetchSpecs = async () => {
      setLoadingSpecs(true);
      try {
        const data = await getAllSpecializations();
        setSpecializations(data || []);
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
      } finally {
        setLoadingSpecs(false);
      }
    };
    fetchSpecs();
  }, []);

  // Close specialization dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specRef.current && !specRef.current.contains(event.target)) {
        setShowSpecs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "User-Agent": "tadawy-app" } },
      );
      const result = await res.json();
      const city = result.address.city || result.address.town || result.address.village || "";
      const locationData = {
        location: city,
        fullLocation: result.display_name,
        latitude: lat,
        longitude: lng,
      };
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
      setFormData((prev) => ({
        ...prev,
        location: city,
        fullLocation: result.display_name,
        latitude: lat,
        longitude: lng,
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  function LocationPicker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        setShowMap(false);
      },
    });
    return <Marker position={position} />;
  }

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        await reverseGeocode(lat, lng);
        setShowMap(false);
      },
      () => alert("Location permission denied"),
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.specializationId) {
      alert("Please select a specialization");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerDoctor(formData);
      navigate("/application-pending");
    } catch (err) {
      console.error("Application failed:", err);
      alert("Submission failed. Please check your data and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSpecs = specializations.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-white from-1% via-teal-200 to-white to-80% dark:from-[#0b2a3a] dark:via-[#0f5a57] dark:to-[#202326] flex items-center justify-center p-4 py-8">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 dark:border-[#334155]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {t('auth.doctor.title', 'Doctor Application')}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          {t('auth.doctor.subtitle', 'Enter your details to get started as a Doctor with TadaWy')}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.personalInfo.firstName', 'First Name')}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.personalInfo.lastName', 'Last Name')}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.personalInfo.email', 'Email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.doctor.password', 'Password')}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.doctor.confirmPassword', 'Confirm')}
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.personalInfo.phoneNumber', 'Phone Number')}
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="+20"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.doctor.careerStartDate', 'Career Start Date')}
              </label>
              <input
                type="date"
                value={formData.careerStartDate}
                onChange={(e) => handleChange("careerStartDate", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                required
              />
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.personalInfo.location', 'Clinic Location')}
            </label>
            <div className="relative cursor-pointer" onClick={() => setShowMap(true)}>
              <input
                readOnly
                value={formData.location || ""}
                placeholder={t('auth.doctor.selectLocation', 'Select your location')}
                className="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg cursor-pointer transition"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('auth.doctor.addressDetails', 'Address Description')}
            </label>
            <input
              type="text"
              value={formData.addressDetails}
              onChange={(e) => handleChange("addressDetails", e.target.value)}
              placeholder={t('auth.doctor.addressPlaceholder', 'Building number, street name, floor, etc.')}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>



          {/* Specialization Searchable Select */}
          <div className="relative" ref={specRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('auth.doctor.specialization', 'Specialization')}
            </label>
            <div 
              className="relative cursor-pointer"
              onClick={() => setShowSpecs(!showSpecs)}
            >
              <div className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white rounded-lg flex items-center justify-between transition min-h-[46px]">
                <span className={formData.specializationName ? "" : "text-gray-400"}>
                  {formData.specializationName || t('auth.doctor.specializationPlaceholder', 'Select or type specialization')}
                </span>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${showSpecs ? "rotate-180" : ""}`} />
              </div>
            </div>

            {showSpecs && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 border-b border-gray-100 dark:border-[#334155] flex items-center gap-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder={t('auth.doctor.searchSpecialization', 'Search specialization...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white"
                  />
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {filteredSpecs.map(s => (
                    <li 
                      key={s.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, specializationId: s.id, specializationName: s.name }));
                        setShowSpecs(false);
                        setSearchTerm("");
                      }}
                      className="px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-500/10 dark:text-gray-300 transition-colors flex items-center justify-between group"
                    >
                      {s.name}
                      <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 text-teal-500 -rotate-90" />
                    </li>
                  ))}
                  {filteredSpecs.length === 0 && searchTerm && !loadingSpecs && (
                    <li className="px-4 py-4 text-center text-sm text-gray-400 italic">No matches found</li>
                  )}
                  {loadingSpecs && (
                    <li className="px-4 py-4 text-center text-sm text-teal-500 animate-pulse">Loading specializations...</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('auth.doctor.uploadCV')}
            </label>
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-[#475569] rounded-xl cursor-pointer hover:border-teal-500 bg-gray-50 dark:bg-[#334155]/50 transition-all hover:bg-teal-50 mt-1">
              {formData.cv ? <FileText className="w-8 h-8 text-teal-500" /> : <Upload className="w-8 h-8 text-gray-400" />}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                {formData.cv ? formData.cv.name : "Select your CV (PDF/DOC)"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange("cv", e.target.files[0])}
                className="hidden"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-lg hover:shadow-teal-500/30 mt-6 flex justify-center items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              t('auth.doctor.signUp', 'Submit Application')
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          {t('auth.doctor.haveAccount', 'Already have an account?')}{" "}
          <Link to={"/login"} className="text-teal-500 dark:text-teal-400 hover:underline font-bold">
            {t('auth.doctor.signIn', 'Sign in')}
          </Link>
        </p>
      </div>

      {/* Map Modal remains the same but styled better */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowMap(false)}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-full transition-colors z-10"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {t('auth.doctor.selectLocationTitle', 'Set Clinic Location')}
            </h3>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full mb-4 flex items-center justify-center gap-2 bg-teal-50 dark:bg-teal-500/10 border-2 border-teal-500 text-teal-600 dark:text-teal-400 py-3 rounded-xl transition-all font-bold hover:bg-teal-100"
            >
              <Crosshair size={20} />
              {t('profile.personalInfo.useLocation', 'Detect My Location')}
            </button>

            <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-[#334155]">
              <MapContainer center={position} zoom={13} className="h-full w-full">
                <FlyTo position={position} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
              </MapContainer>
            </div>

            <div className="mt-4 flex gap-4">
               <button
                  type="button"
                  onClick={() => setShowMap(false)}
                  className="flex-1 bg-gray-100 dark:bg-[#334155] hover:bg-gray-200 dark:hover:bg-[#475569] text-gray-800 dark:text-white py-3 rounded-xl font-bold transition"
                >
                  Confirm Location
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorApplication;
