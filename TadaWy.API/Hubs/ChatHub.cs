using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using TadaWy.Applicaation.DTO.ChatDTOs;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatAppService _chatService;

        public ChatHub(IChatAppService chatService)
        {
            _chatService = chatService;
        }

        public async Task SendMessage(SendMessageDto dto)
        {
            var senderUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(senderUserId))
                throw new HubException("Unauthorized");

            if (dto == null)
                throw new HubException("Invalid message.");

            var message = await _chatService.SendMessageAsync(senderUserId, dto);   

            await Clients.Users(senderUserId, dto.ReceiverUserId).SendAsync("ReceiveMessage", message);

            var unreadCount = await _chatService.GetUnreadCount(dto.ReceiverUserId, senderUserId);

            await Clients.User(dto.ReceiverUserId)
                .SendAsync("UnreadCountUpdated", new
                {
                    fromUserId = senderUserId,
                    unreadCount = unreadCount
                });
        }
    }
}
