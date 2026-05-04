import { LuLogOut } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../services/settingService";
import { toast } from "react-toastify";
import { useState } from "react";

const DangerZone = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const executeDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      toast.success(t('settings.dangerZone.deleteSuccess') || "Account deleted successfully.");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(error.response?.data?.messege || t('settings.dangerZone.deleteError') || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm font-medium text-gray-900 dark:text-gray-500">
            {t('settings.dangerZone.deleteAccountConfirm') || "Are you sure you want to delete your account? This action cannot be undone."}
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 text-xs font-medium rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              {t('common.cancel') || "Cancel"}
            </button>
            <button
              onClick={() => {
                closeToast();
                executeDeleteAccount();
              }}
              className="px-3 py-1.5 text-xs font-medium rounded bg-[#EF4444] text-white hover:bg-red-700 transition-colors"
            >
              {t('settings.dangerZone.deleteAccount') || "Delete"}
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center"
      }
    );
  };

  return (
    <div className="rounded-2xl border border-[#DC262680] dark:border-red-900 w-full max-w-full dark:bg-[#1E293B]">
      <div className="px-4 md:px-6 py-4">
        <h2 className="text-lg font-medium text-red-600 dark:text-red-500">
          {t('settings.dangerZone.title')}
        </h2>
        <p className="text-lg text-[#64748B] dark:text-gray-400 mt-4">
          {t('settings.dangerZone.subtitle')}
        </p>
      </div>

      <div className="px-4 md:px-6 pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
          <div>
            <p className="font-medium text-base sm:text-lg dark:text-white">
              {t('settings.dangerZone.signOut')}
            </p>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400">
              {t('settings.dangerZone.signOutDescription')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 sm:mt-0 flex items-center justify-center gap-2 bg-red-500 dark:bg-red-600 text-white rounded-lg text-sm px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto hover:bg-red-600 dark:hover:bg-red-700"
          >
            <LuLogOut className="text-base sm:text-lg" />
            {t('settings.dangerZone.signOut')}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <p className="font-medium text-base sm:text-lg font-[Inter] dark:text-white">
              {t('settings.dangerZone.deleteAccount')}
            </p>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400">
              {t('settings.dangerZone.deleteAccountDescription')}
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="mt-2 sm:mt-0 px-3 py-2 sm:px-4 sm:py-2 border border-red-500 dark:border-red-600 text-red-500 dark:text-red-400 rounded-lg text-sm w-full sm:w-auto hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
          >
            {isDeleting ? "..." : t('settings.dangerZone.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;