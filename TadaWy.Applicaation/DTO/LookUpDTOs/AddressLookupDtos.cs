namespace TadaWy.Applicaation.DTO.LookUpDTOs
{
    public class StateDto
    {
        public int Id { get; set; }
        public string NameEn { get; set; } = default!;
        public string NameAr { get; set; } = default!;
    }

    public class CityDto
    {
        public int Id { get; set; }
        public string NameEn { get; set; } = default!;
        public string NameAr { get; set; } = default!;
        public int StateId { get; set; }
    }
}