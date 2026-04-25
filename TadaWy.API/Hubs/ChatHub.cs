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

            var message = await _chatService.SendMessageAsync(senderUserId, dto);   

            await Clients.Users(senderUserId, dto.ReceiverUserId).SendAsync("ReceiveMessage", message);
        }
    }
}
