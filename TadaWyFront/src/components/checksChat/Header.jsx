import React from 'react'
import { assets } from '../../assets/assets'
import { X } from 'lucide-react'
import { useTranslation } from "react-i18next";

const Header = ({ setIsOpen }) => {
  const { t, i18n } = useTranslation();
  return (
      <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5 relative bg-[#00BBA7]">
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-start justify-center shrink-0">
          <img src={assets.brainIcon} alt="Brain Icon" className="w-full h-full" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl text-white font-semibold">
            {t("checksChat.title")}
          </div>
          <div className="text-white text-base sm:text-lg font-normal">
            {t("checksChat.subtitle")}
          </div>
        </div>
        <X
          onClick={() => setIsOpen(false)}
          className={`cursor-pointer absolute top-3 sm:top-4 w-6 h-6 sm:w-7 sm:h-7 text-white hover:text-gray-200 transition-colors ${i18n.language === 'ar' ? 'left-3 sm:left-4' : 'right-3 sm:right-4'}`}
        />
      </div>
  )
}

export default Header
