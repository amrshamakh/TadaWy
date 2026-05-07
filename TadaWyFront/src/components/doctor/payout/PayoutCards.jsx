import React from 'react';
import { Wallet, Banknote, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PayoutCards({ totalBalance = 0, availableBalance = 0, onlineEarnings = 0 }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1: Total Balance */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-teal-500" />
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t("doctorDashboard.payout.cards.totalBalance", "TOTAL BALANCE")}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalBalance.toLocaleString()}</h2>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("booking.sidebar.currency", "L.E.")}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Available balance */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
            <Banknote className="w-6 h-6 text-teal-500" />
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            {t("doctorDashboard.payout.cards.availableBalance", "Available balance")}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{availableBalance.toLocaleString()}</h2>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("booking.sidebar.currency", "L.E.")}</span>
          </div>
        </div>
      </div>

      {/* Card 3: Online Patient Earnings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg">
            {t("doctorDashboard.payout.cards.thisMonth", "This Month")}
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t("doctorDashboard.payout.cards.onlineEarnings", "ONLINE PATIENT EARNINGS")}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{onlineEarnings.toLocaleString()}</h2>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t("booking.sidebar.currency", "L.E.")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
