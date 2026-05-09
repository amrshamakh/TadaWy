import React from 'react';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const ApplicationPending = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // A medical-related waiting/review animation
  const lottieUrl = "https://lottie.host/5b210f8a-982c-474c-879e-14187e14d86b/yV9R26v5S7.json";

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-teal-50 to-white dark:from-[#0b2a3a] dark:via-[#0f5a57] dark:to-[#0b2a3a] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-7 border border-gray-100 dark:border-[#334155] text-center space-y-2">
        
        {/* Logo at top - lowered slightly */}
        <div className="flex justify-center pt-4">
          <img className="w-16 h-16" src={assets.logo} alt="logo" />
        </div>

        {/* Animation - Shrunk more to reduce card length */}
        <div className="w-32 h-32 mx-auto">
          <Lottie 
            animationData={null}
            loop={true}
            style={{ width: '100%', height: '100%' }}
            path={lottieUrl}
          />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            {t('auth.doctor.applicationSubmitted', 'Application Submitted!')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            {t('auth.doctor.waitApproval', 'Your application is currently being reviewed by our medical board. We will notify you via email once your account is approved.')}
          </p>
        </div>

        {/* Action */}
        <div className="pt-3">
          <button
            onClick={() => navigate('/')}
            className="px-10 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            {t('common.backToHome', 'Back to Home')}
          </button>
        </div>

        <p className="text-xs text-gray-400 pt-4">
          {t('auth.doctor.checkEmail', 'Expected review time: 1-3 business days.')}
        </p>
      </div>
    </div>
  );
};

export default ApplicationPending;
