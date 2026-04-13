import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingReceiptModal from "./BookingReceiptModal";
import BookingSuccessModal from "./BookingSuccessModal";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

export default function OnlinePayment() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const receiptRef = useRef(null);

  // Fallback data in case user goes to URL directly
  const {
    doctor,
    patientName,
    patientEmail,
    appointmentDateValue,
    appointmentCost,
  } = location.state || {
    doctor: { doctor: "Doctor", address: "Address", specialty: "Specialty", phone: "+20" },
    patientName: "Patient",
    patientEmail: "patient@email.com",
    appointmentDateValue: "Date",
    appointmentCost: 150,
  };

  const receiptNumber = `RX-${Date.now().toString().slice(-10)}`;

  const [formData, setFormData] = useState({
    fullName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setStep(2); // Step 2 is now Success Modal
  };

  const handlePrintReceipt = async () => {
    if (!receiptRef.current || isPrinting) return;
    setIsPrinting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `receipt-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export receipt image", error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleReceiptDone = () => {
    navigate(-1); // Go back when clicking done on receipt
  };

  // Handle success auto-forward to receipt
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(3); // Go to receipt after success
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <div className={`min-h-screen bg-linear-to-b from-1% from-white via-teal-200 to-white to-95% dark:from-[#0b2a3a] dark:via-[#0f5a57] dark:to-[#0b2a3a] dark:to-99% flex p-4 ${step === 1 ? "flex-col items-center pt-8 pb-12" : "items-center justify-center"}`}>
      {step === 1 && (
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] shadow-lg w-full max-w-[540px] p-8 border border-transparent dark:border-[#334155] mt-4">
          <form onSubmit={handleConfirm}>
            {/* Billing Details Section */}
            <h2 className="text-[20px] font-bold text-gray-800 dark:text-white mb-5">
              {t("booking.modals.onlinePayment.billingTitle")}
            </h2>

            <div className="space-y-4 mb-7">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                  {t("booking.modals.onlinePayment.fullNameLabel")}
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder={t("booking.modals.onlinePayment.fullNamePlaceholder")}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                  {t("booking.modals.onlinePayment.addressLabel")}
                </label>
                <input
                  type="text"
                  name="billingAddress"
                  placeholder={t("booking.modals.onlinePayment.addressPlaceholder")}
                  value={formData.billingAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                    {t("booking.modals.onlinePayment.cityLabel")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder={t("booking.modals.onlinePayment.cityPlaceholder")}
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                    {t("booking.modals.onlinePayment.zipLabel")}
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder={t("booking.modals.onlinePayment.zipPlaceholder")}
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                  {t("booking.modals.onlinePayment.countryLabel")}
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder={t("booking.modals.onlinePayment.countryPlaceholder")}
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                  required
                />
              </div>
            </div>

            {/* Payment Information Section */}
            <h2 className="text-[20px] font-bold text-gray-800 dark:text-white mb-5">
              {t("booking.modals.onlinePayment.paymentTitle")}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                  {t("booking.modals.onlinePayment.cardLabel")}
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder={t("booking.modals.onlinePayment.cardPlaceholder")}
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                  {t("booking.modals.onlinePayment.nameOnCardLabel")}
                </label>
                <input
                  type="text"
                  name="nameOnCard"
                  placeholder={t("booking.modals.onlinePayment.nameOnCardPlaceholder")}
                  value={formData.nameOnCard}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                    {t("booking.modals.onlinePayment.expiryLabel")}
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder={t("booking.modals.onlinePayment.expiryPlaceholder")}
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 rtl:text-right text-left">
                    {t("booking.modals.onlinePayment.cvvLabel")}
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder={t("booking.modals.onlinePayment.cvvPlaceholder")}
                    value={formData.cvv}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BBA7]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-white dark:bg-[#334155] border border-gray-200 dark:border-[#475569] text-gray-700 dark:text-gray-300 font-semibold rounded-3xl hover:bg-gray-50 dark:hover:bg-[#475569] transition"
              >
                {t("booking.modals.onlinePayment.cancel")}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00BBA7] hover:bg-[#00a693] text-white font-semibold rounded-3xl transition"
              >
                {t("booking.modals.onlinePayment.confirmBtn")}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <BookingSuccessModal isInline={true} />
      )}

      {step === 3 && (
        <BookingReceiptModal
          isInline={true}
          isOnline={true}
          receiptRef={receiptRef}
          receiptNumber={receiptNumber}
          patientName={patientName}
          patientEmail={patientEmail}
          doctor={doctor}
          appointmentDateValue={appointmentDateValue}
          appointmentCost={appointmentCost}
          isPrinting={isPrinting}
          onPrintReceipt={handlePrintReceipt}
          onDone={handleReceiptDone}
        />
      )}
    </div>
  );
}
