namespace TadaWy.Domain.Entities
{
    public class City
    {
        public int Id { get; set; }
        public string NameEn { get; set; } = default!;
        public string NameAr { get; set; } = default!;

        public int StateId { get; set; }
        public State State { get; set; } = default!;
    }
}