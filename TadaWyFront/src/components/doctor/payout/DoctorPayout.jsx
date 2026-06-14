import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PayoutCards from './PayoutCards';
import PayoutMethod from './PayoutMethod';
import RecentPayments from './RecentPayments';
import { getWalletDashboard } from '../../../services/doctorWalletService';
import { toast } from 'react-toastify';

import { TableSkeleton as PayoutSkeleton } from "@/components/Skeleton";

export default function DoctorPayout() {
  const { t } = useTranslation();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const data = await getWalletDashboard();
      setWalletData(data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error(t("common.errors.serverError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);



  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 font-inter animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {t("doctorDashboard.payout.title", "Payments & Earnings")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("doctorDashboard.payout.subtitle", "Manage your revenue and withdrawal methods")}
        </p>
      </div>

      {loading ? (
        <PayoutSkeleton />
      ) : (
        <>
          <PayoutCards 
            totalBalance={walletData?.totalBalance} 
            availableBalance={walletData?.availableBalance}
            onlineEarnings={walletData?.onlineEarningsThisMonth}
          />
          <PayoutMethod onWithdrawSuccess={fetchWalletData} />
          <RecentPayments payments={walletData?.recentOnlinePayments} />
        </>
      )}
    </div>
  );
}
