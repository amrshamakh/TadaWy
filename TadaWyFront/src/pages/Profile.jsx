import { useState } from "react";
import PersonalInfo from "../components/PersonalInfo";
import MedicalInfo from "../components/MedicalInfo";
import EmergencyContact from "../components/EmergencyContact";
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName:"John ",
      lastName:"Doe",
      email: "omaralsmnajj@igh.com",
      phoneNumber: "+1 (555) 123-4567",
      age: 32,
      gender: "Male",
      location:"Cairo",
      fullLocation: "",
      latitude: null,
      longitude: null,
    },
    medicalInfo: {
      bloodType: "A+",
      allergies: { penicillin: false, peanuts: true },
      chronicDiseases: { hypertension: true },
    },
    emergencyContact: {
      phoneNumber: "+1 (555) 987-6543",
    },
  });

  return (
    <div className="w-auto h-auto">
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            {t('profile.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('profile.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-teal-500 text-white rounded-lg w-25 md:w-30 rtl:w-auto h-10 px-3 text-sm md:text-base  lg:text-lg hover:bg-teal-600 transition-colors"
        >
          {isEditing ? t('common.save') : t('common.edit')}
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

        <EmergencyContact
          phone={profileData.emergencyContact.phoneNumber}
          isEditing={isEditing}
          onChange={(v) =>
            setProfileData((p) => ({
              ...p,
              emergencyContact: { phoneNumber: v },
            }))
          }
        />
      </div>
    </div>
  );
};

export default Profile;