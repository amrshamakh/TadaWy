import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RecentPayments({ payments = [] }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // const payments = [
  //   { id: 1, date: "Oct 12, 2023", name: "Ahmed Mansour", amount: "450" },
  //   { id: 2, date: "Oct 11, 2023", name: "Layla Kamel", amount: "300" },
  //   { id: 3, date: "Oct 11, 2023", name: "Mohamed Hassan", amount: "450" },
  //   { id: 4, date: "Oct 10, 2023", name: "Safa Reda", amount: "600" },
  // ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {t("doctorDashboard.payout.recentPayments.title", "Recent Online Payments")}
        </h3>
        <button 
          onClick={() => console.log("View All Transactions clicked")}
          className="text-sm font-semibold text-teal-600 dark:text-teal-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
        >
          {t("doctorDashboard.payout.recentPayments.viewAll", "View All Transactions")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className={`pb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3 ${isAr ? 'text-right' : 'text-left'}`}>
                {t("doctorDashboard.payout.recentPayments.columns.date", "DATE")}
              </th>
              <th className={`pb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3 ${isAr ? 'text-right' : 'text-left'}`}>
                {t("doctorDashboard.payout.recentPayments.columns.patientName", "PATIENT NAME")}
              </th>
              <th className={`pb-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3 ${isAr ? 'text-right' : 'text-left'}`}>
                {t("doctorDashboard.payout.recentPayments.columns.amount", "AMOUNT")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {payments?.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className={`py-4 text-sm font-medium text-slate-600 dark:text-slate-300 ${isAr ? 'text-right' : 'text-left'}`}>
                    {payment.date}
                  </td>
                  <td className={`py-4 text-sm font-medium text-slate-900 dark:text-white ${isAr ? 'text-right' : 'text-left'}`}>
                    {payment.name}
                  </td>
                  <td className={`py-4 text-sm font-bold text-slate-900 dark:text-white ${isAr ? 'text-right' : 'text-left'}`}>
                    {payment.amount} <span className="font-semibold text-slate-500 dark:text-slate-400">{t("booking.sidebar.currency", "L.E.")}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-8 text-center text-slate-500 dark:text-slate-400">
                  {t("doctorDashboard.payout.recentPayments.noPayments", "No recent payments found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
