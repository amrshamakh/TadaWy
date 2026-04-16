namespace TadaWy.Applicaation.DTO.PaymobDtos
{
    public class PaymobCallbackObject
    {
        public int Id { get; set; }              
        public int AmountCents { get; set; }
        public PaymobCallbackOrder Order { get; set; }
    }
}
