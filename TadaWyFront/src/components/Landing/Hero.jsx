import { RiPulseFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <section className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${assets.container})` }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto my-auto p-15 sm:p-20 lg:p-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-full text-sm mb-6 shadow-lg">
          <RiPulseFill className="w-5 h-5" />
          {t("hero.badge")}
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5 lg:mb-6">
          {t("hero.title")}
          <span className="text-teal-500 text-4xl sm:text-5xl md:text-7xl lg:text-8xl">{t("hero.appName")}</span>
        </h1>

        {/* Subheading */}
        <p className="sm:text-lg md:text-xl dark:text-gray-300 text-gray-700 max-w-2xl mb-8">
          {t("hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mb-10 md:mb-12 lg:mb-16">
          <button
            onClick={() => {
              navigate("/discover");
              scrollTo(0, 0);
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2 rounded-lg font-medium transition-colors shadow-xl"
          >
            {t("hero.getStarted")}
          </button>
          {!user && (
            <button
              onClick={() => {
                navigate("/login");
                scrollTo(0, 0);
              }}
              className="bg-white dark:text-white dark:bg-[#3341554D] hover:bg-gray-50 dark:hover:bg-[#334155] text-gray-800 px-8 py-2 rounded-lg font-medium border border-gray-300 dark:border-[#334155] transition-colors shadow-xl"
            >
              {t("hero.signIn")}
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl sm:max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg max-w-50 lg:max-w-55">
            <h3 className="text-4xl font-bold text-teal-500 mb-2">
              {t("hero.stats.providers")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("hero.stats.providersLabel")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg max-w-50 lg:max-w-55">
            <h3 className="text-4xl font-bold text-teal-500 mb-2">
              {t("hero.stats.patients")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("hero.stats.patientsLabel")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg max-w-50 lg:max-w-55">
            <h3 className="text-4xl font-bold text-teal-500 mb-2">
              {t("hero.stats.support")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("hero.stats.supportLabel")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;