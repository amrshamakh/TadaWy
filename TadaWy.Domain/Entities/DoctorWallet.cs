namespace TadaWy.Domain.Entities
{
    public class DoctorWallet
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }

        public decimal Balance { get; set; } = 0;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
