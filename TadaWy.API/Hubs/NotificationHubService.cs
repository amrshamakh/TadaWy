using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.NotificationDTOs;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Hubs
{
    public class NotificationHubService : INotificationHubService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationHubService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendNotificationAsync(string userId, NotificationDto notification)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", notification);
        }
    }
}
