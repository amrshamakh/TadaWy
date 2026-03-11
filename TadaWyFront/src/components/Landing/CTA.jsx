import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="pb-25">
      <div className="max-w-3xl bg-[#00BBA70D] mx-auto my-auto pb-3 pt-2 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-6">
          {t("cta.title")}
        </h2>
        <p className="text-lg dark:text-gray-400 text-gray-500 mb-10 max-w-2xl mx-auto">
          {t("cta.subtitle")}
        </p>
        <button
          onClick={() => {
            navigate("/signup");
            scrollTo(0, 0);
          }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-1.5 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          {t("cta.createAccount")}
        </button>
      </div>
    </section>
  );
};

export default CTA;