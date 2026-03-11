import { RiPulseFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t("features.items.findClinics.title"),
      description: t("features.items.findClinics.description"),
    },
    {
      icon: (
        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: t("features.items.bookAppointments.title"),
      description: t("features.items.bookAppointments.description"),
    },
    {
      icon: (
        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: t("features.items.manageHealth.title"),
      description: t("features.items.manageHealth.description"),
    },
    {
      icon: <RiPulseFill className="w-8 h-8 text-teal-500" />,
      title: t("features.items.aiInsights.title"),
      description: t("features.items.aiInsights.description"),
    },
  ];

  return (
    <section className="py-25 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="xs:hidden text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-4">
            {t("features.sectionTitle")}
          </h2>
          <p className="text-lg dark:text-gray-400 text-gray-600 max-w-3xl mx-auto">
            {t("features.sectionSubtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="dark:bg-[#1E293B] bg-white border dark:border-[#334155] border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="dark:bg-[#00D4BD1A] bg-teal-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;