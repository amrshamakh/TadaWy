using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.ChatDTOs
{
    // DTO for Fronted sending a message Request to Backend
    public class SendMessageDto
    {
        public string ReceiverUserId { get; set; } = default!;

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }
    }
}
