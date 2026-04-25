using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.NotificationDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface INotificationHubService
    {
        Task SendNotificationAsync(string userId, NotificationDto notification);
    }
}
