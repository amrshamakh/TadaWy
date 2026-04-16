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
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl w-full max-w-lg p-10 border border-gray-100 dark:border-[#334155] text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
            <img className="w-16 h-16" src={assets.logo} alt="logo" />
          </div>
        </div>

        {/* Animation */}
        <div className="w-64 h-64 mx-auto">
          <Lottie 
            animationData={null} // We'll fetch the JSON or use a local one
            loop={true}
            style={{ width: '100%', height: '100%' }}
            // Fallback for demo
            path={lottieUrl}
          />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('auth.doctor.applicationSubmitted', 'Application Submitted!')}
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            {t('auth.doctor.waitApproval', 'Your application is currently being reviewed by our medical board. We will notify you via email once your account is approved.')}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          {t('common.backToHome', 'Back to Home')}
        </button>

        <p className="text-sm text-gray-400">
          {t('auth.doctor.checkEmail', 'Expected review time: 1-3 business days.')}
        </p>
      </div>
    </div>
  );
};

export default ApplicationPending;
