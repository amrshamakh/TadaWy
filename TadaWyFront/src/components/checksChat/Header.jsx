import React from 'react'
import { assets } from '../../assets/assets'
import { X } from 'lucide-react'
import { useTranslation } from "react-i18next";

const Header = ({ setIsOpen }) => {
  const { t } = useTranslation();
  return (
      <div
                className="flex items-center gap-3 px-4 py-3 relative bg-[#00BBA7]"
                
              >
                
                <div className="w-10 h-10 flex items-start justify-center shrink-0">
                  <img src={assets.brainIcon} alt="Brain Icon" className="w-full h-full" />
                </div>
                <div >
                  <div className="text-lg text-white "
                    
                  >
                    {t("checksChat.title")}
                  </div>
                  <div className="text-white text-sm font-normal"
                    
                  >
                    {t("checksChat.subtitle")}
                  </div>
                </div>
                 <X  onClick={() => setIsOpen(false)} className=" 
                 cursor-pointer absolute top-2 right-2 w-5 h-5 text-white hover:text-gray-200 text-[2px] transition-colors"/>
              </div>
  )
}

export default Header
