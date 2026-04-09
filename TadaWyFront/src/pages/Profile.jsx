import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfo from "../components/PersonalInfo";
import MedicalInfo from "../components/MedicalInfo";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  getPatientProfile,
  updatePatientProfile,
  getPatientAllergies,
  addPatientAllergy,
  removePatientAllergy,
  getPatientChronicDiseases,
  addPatientChronicDisease,
  removePatientChronicDisease,
  getAllAllergies,
  getAllChronicDiseases,
} from "../modules/patient/api/profilePatientAPi";

const Profile = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ─── Redirect to login if not authenticated ───────────────
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // ─── Profile data (personal) ──────────────────────────────
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      age: "",
      gender: "",
      location: "",
      fullLocation: "",
      latitude: null,
      longitude: null,
      dateOfBirth: "",
    },
    medicalInfo: {
      bloodType: "",
      allergies: {},
      chronicDiseases: {},
    },
  });

  // ─── Lookup master lists (for toggle checkboxes) ──────────
  const [allAllergies, setAllAllergies] = useState([]);       // [{ id, name }]
  const [allDiseases, setAllDiseases] = useState([]);          // [{ id, name }]

  // ─── Patient's current allergies/diseases from backend ────
  const [patientAllergyIds, setPatientAllergyIds] = useState([]);
  const [patientDiseaseIds, setPatientDiseaseIds] = useState([]);

  // ─── Helper: map Gendre enum (0=Male, 1=Female) to string ─
  const gendreToString = (val) => {
    if (val === 0) return "Male";
    if (val === 1) return "Female";
    return String(val ?? "");
  };

  const stringToGendre = (str) => {
    if (str === "Male") return 0;
    if (str === "Female") return 1;
    return null;
  };

  // ─── Helper: calculate age from DateOfBirth ───────────────
  const calcAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // ─── Fetch everything on mount ────────────────────────────
  useEffect(() => {
    if (authLoading || !user) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel — each with its own .catch so one failure doesn't block the rest
        const [profile, patientAllergies, patientDiseases, lookupAllergies, lookupDiseases] =
          await Promise.all([
            getPatientProfile(),
            getPatientAllergies().catch(() => []),
            getPatientChronicDiseases().catch(() => []),
            getAllAllergies().catch(() => []),
            getAllChronicDiseases().catch(() => []),
          ]);

        // Normalize lookup arrays (handle { id, name } or { Id, Name } casing)
        const normalizeLookup = (arr) =>
          (Array.isArray(arr) ? arr : []).map((item) => ({
            id: item.id ?? item.Id,
            name: item.name ?? item.Name,
          }));

        const normalizedAllergies = normalizeLookup(lookupAllergies);
        const normalizedDiseases = normalizeLookup(lookupDiseases);
        const normalizedPatientAllergies = normalizeLookup(patientAllergies);
        const normalizedPatientDiseases = normalizeLookup(patientDiseases);

        // Save lookup master lists
        setAllAllergies(normalizedAllergies);
        setAllDiseases(normalizedDiseases);

        // Build patient allergy/disease id-sets for quick lookup
        const pAllergyIds = normalizedPatientAllergies.map((a) => a.id);
        const pDiseaseIds = normalizedPatientDiseases.map((d) => d.id);
        setPatientAllergyIds(pAllergyIds);
        setPatientDiseaseIds(pDiseaseIds);

        // Build allergies object: { [name]: boolean } from lookup list
        const allergiesObj = {};
        normalizedAllergies.forEach((a) => {
          allergiesObj[a.name] = pAllergyIds.includes(a.id);
        });

        // Build chronic diseases object
        const diseasesObj = {};
        normalizedDiseases.forEach((d) => {
          diseasesObj[d.name] = pDiseaseIds.includes(d.id);
        });

        setProfileData({
          personalInfo: {
            firstName: profile.firstName ?? profile.FirstName ?? "",
            lastName: profile.lastName ?? profile.LastName ?? "",
            email: profile.email ?? profile.Email ?? "",
            phoneNumber: profile.phoneNumber ?? profile.PhoneNumber ?? "",
            age: calcAge(profile.dateOfBirth ?? profile.DateOfBirth),
            gender: gendreToString(profile.gendre ?? profile.Gendre),
            location: (profile.address ?? profile.Address)?.city ?? (profile.address ?? profile.Address)?.City ?? "",
            fullLocation: (profile.address ?? profile.Address)
              ? `${(profile.address ?? profile.Address).street ?? (profile.address ?? profile.Address).Street ?? ""}, ${(profile.address ?? profile.Address).city ?? (profile.address ?? profile.Address).City ?? ""}, ${(profile.address ?? profile.Address).state ?? (profile.address ?? profile.Address).State ?? ""}`
              : "",
            latitude: null,
            longitude: null,
            dateOfBirth: profile.dateOfBirth ?? profile.DateOfBirth ?? "",
          },
          medicalInfo: {
            bloodType: profile.bloodType ?? profile.BloodType ?? "",
            allergies: allergiesObj,
            chronicDiseases: diseasesObj,
          },
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(t("profile.loadError") || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authLoading, user]);

  // ─── Save handler ─────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // 1) Update basic profile
      const updateDto = {
        firstName: profileData.personalInfo.firstName,
        lastName: profileData.personalInfo.lastName,
        phoneNumber: profileData.personalInfo.phoneNumber,
        bloodType: profileData.medicalInfo.bloodType || null,
        gendre: stringToGendre(profileData.personalInfo.gender),
        dateOfBirth: profileData.personalInfo.dateOfBirth || null,
      };
      await updatePatientProfile(updateDto);

      // 2) Sync allergies – diff current vs original
      const currentAllergyIds = allAllergies
        .filter((a) => profileData.medicalInfo.allergies[a.name])
        .map((a) => a.id);

      const allergiesToAdd = currentAllergyIds.filter(
        (id) => !patientAllergyIds.includes(id)
      );
      const allergiesToRemove = patientAllergyIds.filter(
        (id) => !currentAllergyIds.includes(id)
      );

      await Promise.all([
        ...allergiesToAdd.map((id) => addPatientAllergy(id)),
        ...allergiesToRemove.map((id) => removePatientAllergy(id)),
      ]);

      // 3) Sync chronic diseases – diff current vs original
      const currentDiseaseIds = allDiseases
        .filter((d) => profileData.medicalInfo.chronicDiseases[d.name])
        .map((d) => d.id);

      const diseasesToAdd = currentDiseaseIds.filter(
        (id) => !patientDiseaseIds.includes(id)
      );
      const diseasesToRemove = patientDiseaseIds.filter(
        (id) => !currentDiseaseIds.includes(id)
      );

      await Promise.all([
        ...diseasesToAdd.map((id) => addPatientChronicDisease(id)),
        ...diseasesToRemove.map((id) => removePatientChronicDisease(id)),
      ]);

      // Update local state to reflect saved ids
      setPatientAllergyIds(currentAllergyIds);
      setPatientDiseaseIds(currentDiseaseIds);

      // Refresh auth context (Navbar etc.)
      await fetchUser();

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(t("profile.saveError") || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Toggle edit / save ───────────────────────────────────
  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // ─── Loading state ────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) return null; // will redirect via useEffect

  return (
    <div className="w-auto h-auto">
      {/* ERROR BANNER */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            {t("profile.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("profile.subtitle")}
          </p>
        </div>

        <button
          onClick={handleEditToggle}
          disabled={saving}
          className="bg-teal-500 text-white rounded-lg w-25 md:w-30 rtl:w-auto h-10 px-3 text-sm md:text-base lg:text-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? t("common.saving") || "Saving..."
            : isEditing
            ? t("common.save")
            : t("common.edit")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PersonalInfo
          data={profileData.personalInfo}
          isEditing={isEditing}
          onChange={(key, value) =>
            setProfileData((prev) => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, [key]: value },
            }))
          }
        />

        <MedicalInfo
          data={profileData.medicalInfo}
          isEditing={isEditing}
          onBloodChange={(v) =>
            setProfileData((p) => ({
              ...p,
              medicalInfo: { ...p.medicalInfo, bloodType: v },
            }))
          }
          toggleAllergy={(a) =>
            setProfileData((p) => ({
              ...p,
              medicalInfo: {
                ...p.medicalInfo,
                allergies: {
                  ...p.medicalInfo.allergies,
                  [a]: !p.medicalInfo.allergies[a],
                },
              },
            }))
          }
          toggleDisease={(d) =>
            setProfileData((p) => ({
              ...p,
              medicalInfo: {
                ...p.medicalInfo,
                chronicDiseases: {
                  ...p.medicalInfo.chronicDiseases,
                  [d]: !p.medicalInfo.chronicDiseases[d],
                },
              },
            }))
          }
        />
      </div>
    </div>
  );
};

export default Profile;