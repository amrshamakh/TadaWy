import React, { useState, useRef } from 'react';
import { Edit2, Banknote, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PayoutMethod() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [amount, setAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50">
      <style>
        {`
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        {t("doctorDashboard.payout.payoutMethod.title", "Payout Method")}
      </h3>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start md:items-center">
        {/* Left Input Section */}
        <div className="w-full md:w-3/5 relative">
          <div className={`flex items-center rounded-xl overflow-hidden border transition-all duration-300 ${
            isEditing 
              ? 'bg-white dark:bg-slate-900 border-teal-500 ring-4 ring-teal-500/10 shadow-lg shadow-teal-500/5' 
              : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
          }`}>
            <input 
              ref={inputRef}
              type="number" 
              disabled={!isEditing}
              placeholder={t("doctorDashboard.payout.payoutMethod.placeholder", "Enter an Amount")}
              className={`w-full bg-transparent px-4 py-3.5 text-slate-700 dark:text-slate-300 outline-none text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-opacity ${isAr ? 'text-right' : 'text-left'} ${!isEditing ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button 
              onClick={handleEditToggle}
              className={`flex items-center gap-1.5 px-4 h-full font-semibold text-sm transition-all shrink-0 ${
                isEditing 
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 py-3.5' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              <span>{isEditing ? t("common.save", "Save") : t("doctorDashboard.payout.payoutMethod.edit", "Edit")}</span>
            </button>
          </div>
        </div>

        {/* Right Button Section */}
        <div className="w-full md:w-2/5 flex flex-col items-center gap-3">
          <button className="w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
            <Banknote className="w-5 h-5" />
            <span>{t("doctorDashboard.payout.payoutMethod.withdrawBtn", "Withdraw Funds")}</span>
          </button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("doctorDashboard.payout.payoutMethod.withdrawTo", "Withdraw to your VISA Card")}
          </span>
        </div>
      </div>
    </div>
  );
}
