import { User, MapPin, Search, Crosshair } from "lucide-react";
import { useState,useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

/*  Fix Leaflet marker icon */
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

const PersonalInfo = ({ data, isEditing, onChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [showMap, setShowMap] = useState(false);
  
   const LOCATION_STORAGE_KEY = "personal_location";

 const storedLocation = JSON.parse(
  localStorage.getItem(LOCATION_STORAGE_KEY)
);

const [position, setPosition] = useState(
  storedLocation?.latitude && storedLocation?.longitude
    ? [storedLocation.latitude, storedLocation.longitude]
    : data.latitude && data.longitude
    ? [data.latitude, data.longitude]
    : [30.0444, 31.2357]
);


  const fields = [
    ["firstName", t("profile.personalInfo.firstName")],
    ["lastName", t("profile.personalInfo.lastName")],
    ["email", t("profile.personalInfo.email")],
    ["phoneNumber", t("profile.personalInfo.phoneNumber")],
    ["age", t("profile.personalInfo.age")],
    ["gender", t("profile.personalInfo.gender")],
  ];

  /*  Reverse Geocode */
 const reverseGeocode = async (lat, lng) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    { headers: { "User-Agent": "profile-app" } }
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

  // 🔐 save to localStorage
  localStorage.setItem(
    LOCATION_STORAGE_KEY,
    JSON.stringify(locationData)
  );

  // update UI / parent state
  onChange("location", city);
  onChange("fullLocation", result.display_name);
  onChange("latitude", lat);
  onChange("longitude", lng);
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

  /*  Current location */
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
  useEffect(() => {
  const stored = JSON.parse(
    localStorage.getItem(LOCATION_STORAGE_KEY)
  );

  if (!stored) return;

  onChange("location", stored.location);
  onChange("fullLocation", stored.fullLocation);
  onChange("latitude", stored.latitude);
  onChange("longitude", stored.longitude);
}, []);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm"
    >
      {/* HEADER */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 dark:text-white" />
          <h2 className="text-xl font-bold dark:text-white">
            {t("profile.personalInfo.title")}
          </h2>
        </div>
      </div>

      {/* FIELDS */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        {fields.map(([key, label]) => (
          <div key={key}>
            <p className="text-sm font-medium mb-1 dark:text-white">{label}</p>
            <input
              disabled={!isEditing}
              value={data[key] || ""}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full font-normal text-sm px-3 py-2 border border-white dark:border-[#334155] outline-teal-500 text-gray-500 bg-[#F8FAFC] dark:bg-[#04070a4d] tracking-tight"
            />
          </div>
        ))}

        {/*  LOCATION INPUT */}
        <div className="col-span-2">
          <p className="text-sm font-medium mb-1 dark:text-white">
            {t("profile.personalInfo.location")}
          </p>

          <div
            className="relative cursor-pointer"
            onClick={() => isEditing && setShowMap(true)}
          >
            <input
              readOnly
              value={data.location || ""}
              placeholder="City, Town, Address"
              className="w-full font-normal text-sm px-3 py-2 border border-white dark:border-[#334155] outline-teal-500 text-gray-500 bg-[#F8FAFC] dark:bg-[#04070a4d] tracking-tight"
            />
            <MapPin
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                isRTL ? "left-3" : "right-3"
              }`}
            />
          </div>
        </div>
      </div>

      {/*  MAP MODAL */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="bg-white dark:bg-[#1E293B] rounded-xl w-[90%] max-w-3xl p-4 space-y-3"
          >
            {/* CURRENT LOCATION */}
            <button
              onClick={getCurrentLocation}
              className="flex items-center justify-center gap-2 border border-teal-500 text-teal-600 py-2 rounded"
            >
              <Crosshair size={18} />
              {t("profile.personalInfo.useLocation")}
            </button>

            {/* MAP */}
            <MapContainer
              center={position}
              zoom={13}
              className="h-[400px] w-full rounded-lg"
            >
              <FlyTo position={position} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker />
            </MapContainer>

            <button
              onClick={() => setShowMap(false)}
              className="w-full bg-gray-200 py-2 rounded"
            >
              {t("Close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
