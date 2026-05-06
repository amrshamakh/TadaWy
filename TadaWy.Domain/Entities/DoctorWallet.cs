namespace TadaWy.Domain.Entities
{
    public class DoctorWallet
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }

        // إجمالي أرباح الدكتور من المنصة (بعد خصم عمولة السيستم، وقبل السحوبات)
        public decimal TotalBalance { get; set; } = 0;

        // المبلغ المتاح للسحب فعليًا
        public decimal AvailableBalance { get; set; } = 0;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}