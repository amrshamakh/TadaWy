using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TadaWy.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
    }
}
