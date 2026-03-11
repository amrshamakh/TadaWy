import { useState } from "react";
import { MapPin, Crosshair } from "lucide-react";
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
import { useTranslation } from "react-i18next";

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

const SignUp = () => {
  const { t } = useTranslation();
  const LOCATION_STORAGE_KEY = "signup_location";

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
    gender: "",
    dateOfBirth: { day: "", month: "", year: "" },
  });

  const [showMap, setShowMap] = useState(false);

  const [position, setPosition] = useState(
    storedLocation?.latitude && storedLocation?.longitude
      ? [storedLocation.latitude, storedLocation.longitude]
      : [30.0444, 31.2357],
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: { ...prev.dateOfBirth, [field]: value },
    }));
  };

  /* Reverse Geocode */
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

      setFormData((prev) => ({
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
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        setShowMap(false);
      },
    });

    return <Marker position={position} />;
  }

  /* Current location */
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    console.log("Signup data:", formData);
  };
  const navigate=useNavigate()

  return (
    <div
      className="min-h-screen bg-linear-to-b from-white from-1%
via-teal-200
to-white to-80%  dark:from-[#0b2a3a] 
dark:via-[#0f5a57] 
dark:to-[#202326] flex items-center justify-center p-4 py-8"
    >
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200 dark:border-[#334155]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {t("auth.signup.title", "Create an account")}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          {t(
            "auth.signup.subtitle",
            "Enter your details to get started with TadaWy",
          )}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.personalInfo.firstName", "First Name")}
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="John"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.personalInfo.lastName", "Last Name")}
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.personalInfo.email", "Email")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("auth.signup.password", "Password")}
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={t(
                  "auth.signup.createPassword",
                  "Create a password",
                )}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("auth.signup.confirmPassword", "Confirm Password")}
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder={t(
                  "auth.signup.confirmPasswordPlaceholder",
                  "Confirm your password",
                )}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.personalInfo.phoneNumber", "Phone Number")}
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="+20 123 456 7890"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("profile.personalInfo.location", "Location")}
            </label>
            <div
              className="relative cursor-pointer"
              onClick={() => setShowMap(true)}
            >
              <input
                readOnly
                value={formData.location || ""}
                placeholder={t(
                  "auth.signup.selectLocation",
                  "Select your location",
                )}
                className="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition cursor-pointer"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Gender and Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("profile.personalInfo.gender", "Gender")}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border dark:border-[#475569] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              >
                <option value="">{t("auth.signup.none", "None")}</option>
                <option value="male">{t("auth.signup.male", "Male")}</option>
                <option value="female">
                  {t("auth.signup.female", "Female")}
                </option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("auth.signup.dateOfBirth", "Date Of Birth")}
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  maxLength="2"
                  placeholder="DD"
                  value={formData.dateOfBirth.day}
                  onChange={(e) => handleDateChange("day", e.target.value)}
                  className="w-1/3 px-2 py-2.5 text-center bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
                />
                <input
                  type="text"
                  maxLength="2"
                  placeholder="MM"
                  value={formData.dateOfBirth.month}
                  onChange={(e) => handleDateChange("month", e.target.value)}
                  className="w-1/3 px-2 py-2.5 text-center bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
                />
                <input
                  type="text"
                  maxLength="4"
                  placeholder="YYYY"
                  value={formData.dateOfBirth.year}
                  onChange={(e) => handleDateChange("year", e.target.value)}
                  className="w-1/3 px-2 py-2.5 text-center bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg mt-6"
          >
            {t("auth.signup.signUp", "Sign Up")}
          </button>
          <span className="block text-center my-0.5 font-medium text-black dark:text-gray-400">OR</span>
           <button onClick={()=>navigate('/doctorApplication')}
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg mt-6"
          >
            {t("auth.doctor.signUp")}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          {t("auth.signup.haveAccount", "Already have an account?")}{" "}
          <Link
            to={"/login"}
            className="text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold"
          >
            {t("auth.signup.signIn", "Sign in")}
          </Link>
        </p>
      </div>

      {/* MAP MODAL */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl w-full max-w-3xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("auth.signup.selectLocationTitle", "Select Your Location")}
            </h3>

            {/* Current Location Button */}
            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full flex items-center justify-center gap-2 border-2 border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 py-2.5 rounded-lg transition font-medium"
            >
              <Crosshair size={20} />
              {t("profile.personalInfo.useLocation", "Use Current Location")}
            </button>

            {/* Map */}
            <MapContainer
              center={position}
              zoom={13}
              className="h-100 w-full rounded-lg"
            >
              <FlyTo position={position} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker />
            </MapContainer>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="w-full bg-gray-200 dark:bg-[#334155] hover:bg-gray-300 dark:hover:bg-[#475569] text-gray-800 dark:text-white py-2.5 rounded-lg font-medium transition"
            >
              {t("common.close", "Close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
