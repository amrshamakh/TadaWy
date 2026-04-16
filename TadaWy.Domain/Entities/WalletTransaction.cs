namespace TadaWy.Domain.Entities
{
    public class WalletTransaction
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }

        public decimal Amount { get; set; }

        public TransactionType Type { get; set; } 

        public int? PaymentId { get; set; }
        public int? WithdrawRequestId { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
