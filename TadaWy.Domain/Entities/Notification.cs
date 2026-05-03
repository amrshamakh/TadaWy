using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Enums;

namespace TadaWy.Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public string UserId { get; set; } = default!;
        public ApplicationUser User { get; set; } = default!;
        public string TitleEn { get; set; } = default!;
        public string TitleAr { get; set; } = default!;
        public string MessageEn { get; set; } = default!;
        public string MessageAr { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        public NotificationType Type { get; set; }
        public int? AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }
    }
}
