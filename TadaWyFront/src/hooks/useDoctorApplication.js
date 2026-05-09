import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSpecializations } from "../modules/doctor/api/lookupApi";
import { registerDoctor } from "../modules/doctor/api/registerDoctorApi";

const LOCATION_STORAGE_KEY = "doctor_location";

export const useDoctorApplication = () => {
  const navigate = useNavigate();
  const specRef = useRef(null);

  const storedLocation = JSON.parse(
    localStorage.getItem(LOCATION_STORAGE_KEY) || "{}"
  );

  const [formData, setFormData] = useState({
    firstNameEn: "",
    lastNameEn: "",
    firstNameAr: "",
    lastNameAr: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: storedLocation?.location || "",
    fullLocation: storedLocation?.fullLocation || "",
    latitude: storedLocation?.latitude || null,
    longitude: storedLocation?.longitude || null,
    addressDescriptionEn: "",
    addressDescriptionAr: "",
    bioEn: "",
    bioAr: "",
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
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(
    storedLocation?.latitude && storedLocation?.longitude
      ? [storedLocation.latitude, storedLocation.longitude]
      : [30.0444, 31.2357]
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

  const handleMapClick = (lat, lng) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
    setShowMap(false);
  };

  const getCurrentLocation = () => {
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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

  const filteredSpecs = specializations.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    formData,
    setFormData,
    specializations,
    loadingSpecs,
    searchTerm,
    setSearchTerm,
    showSpecs,
    setShowSpecs,
    isSubmitting,
    showMap,
    setShowMap,
    position,
    setPosition,
    specRef,
    handleChange,
    handleFileChange,
    getCurrentLocation,
    handleSubmit,
    filteredSpecs,
    handleMapClick,
  };
};
