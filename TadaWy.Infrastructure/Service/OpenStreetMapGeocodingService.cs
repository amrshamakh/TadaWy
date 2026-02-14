using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AddressDto;
using TadaWy.Applicaation.IService;

namespace TadaWy.Infrastructure.Service
{
    public class OpenStreetMapGeocodingService : IGeocodingService
    {
        private readonly HttpClient _httpClient;

        public OpenStreetMapGeocodingService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<AddressDto?> GetAddressAsync(double? latitude, double? longitude)
        {
            var url = $"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&addressdetails=1";

            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("TadaWyApp");

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();

            using var document = JsonDocument.Parse(content);

            var addressElement = document.RootElement.GetProperty("address");

            return new AddressDto
            {
                Street = addressElement.TryGetProperty("road", out var road) ? road.GetString() : null,
                City = addressElement.TryGetProperty("city", out var city) ? city.GetString() : null,
                State = addressElement.TryGetProperty("state", out var state) ? state.GetString() : null
            };
        }
    }
}
