using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.ChatDTOs
{
    // DTO for Backend sending a conversation inbox list Response to Fronted
    public class ConversationDto
    {
        public string UserId { get; set; } = default!;

        public string FullName { get; set; } = default!;

        public string? ImageUrl { get; set; }

        public string? LastMessage { get; set; }

        public DateTime? LastMessageDate { get; set; }

        public bool IsSeen { get; set; }
        public int UnreadCount { get; set; }

        public string? SpecializationName { get; set; }
    }
}
