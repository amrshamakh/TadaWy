import ApiClient from "./ApiClient";

/**
 * Get doctor wallet dashboard data.
 * @returns {Promise<{totalBalance: number, availableBalance: number, onlineEarningsThisMonth: number, recentOnlinePayments: Array<{id: number, date: string, name: string, amount: string}>}>}
 */
export const getWalletDashboard = () => ApiClient.get("/DoctorWallet/dashboard");

/**
 * Withdraw funds from doctor wallet.
 * @param {number} amount
 * @returns {Promise<any>}
 */
export const withdrawFunds = (amount) => ApiClient.post("/DoctorWallet/withdraw", amount);
