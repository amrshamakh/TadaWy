using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class Message
    {
        public int Id { get; set; }

        public string SenderUserId { get; set; } = default!;

        public string ReceiverUserId { get; set; } = default!;

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsSeen { get; set; } = false;
    }
}
