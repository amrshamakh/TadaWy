import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assets } from "../../assets/assets";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-[#334155] pt-8 pb-18  w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => {
              navigate("/");
              scrollTo(0, 0);
            }}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={assets.logo} alt="TadaWy Logo" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold dark:text-white text-gray-900">
              TadaWy
            </span>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-1 dark:text-gray-400 text-gray-600">
            <span>{t("footer.madeWith")}</span>
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t("footer.madeWithSuffix")}</span>
          </div>

          {/* Copyright */}
          <div className="text-gray-600 dark:text-gray-400">
            {t("footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;