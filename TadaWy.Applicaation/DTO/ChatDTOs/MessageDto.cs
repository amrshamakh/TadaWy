using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.ChatDTOs
{
    // DTO for Backend sending a message Response to Fronted
    public class MessageDto
    {
        public int Id { get; set; }

        public string SenderUserId { get; set; } = default!;

        public string ReceiverUserId { get; set; } = default!;

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsSeen { get; set; }
    }
}
