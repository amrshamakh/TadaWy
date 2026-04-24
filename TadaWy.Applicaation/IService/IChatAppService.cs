using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.ChatDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface IChatAppService
    {
        Task<MessageDto> SendMessageAsync(string senderUserId, SendMessageDto dto);

        Task<List<MessageDto>> GetChatHistoryAsync(string userId, string otherUserId, DateTime? lastCreatedAt);

        Task<List<ConversationDto>> GetConversationsAsync(string userId, string? search);
        Task MarkMessagesAsSeenAsync(string userId, string otherUserId);
    }
}
