namespace TadaWy.Applicaation.DTO.PaymobDtos
{
    public class PaymobCallbackDto
    {
        public bool Success { get; set; }
        public string Hmac { get; set; }
        public PaymobCallbackObject Obj { get; set; }
    }
}
