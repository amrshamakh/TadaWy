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
            if (latitude == null || longitude == null) return null;

            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("TadaWyApp");

            string? streetEn = null, cityEn = null, stateEn = null;
            string? streetAr = null, cityAr = null, stateAr = null;

            // Fetch English address
            var urlEn = $"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&addressdetails=1&accept-language=en";
            var responseEn = await _httpClient.GetAsync(urlEn);
            if (responseEn.IsSuccessStatusCode)
            {
                var contentEn = await responseEn.Content.ReadAsStringAsync();
                using var docEn = JsonDocument.Parse(contentEn);
                if (docEn.RootElement.TryGetProperty("address", out var addrEn))
                {
                    streetEn = addrEn.TryGetProperty("road", out var road) ? road.GetString() : null;
                    cityEn = addrEn.TryGetProperty("city", out var city) ? city.GetString() : (addrEn.TryGetProperty("town", out var town) ? town.GetString() : (addrEn.TryGetProperty("village", out var village) ? village.GetString() : null));
                    stateEn = addrEn.TryGetProperty("state", out var state) ? state.GetString() : null;
                }
            }

            // Fetch Arabic address
            var urlAr = $"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&addressdetails=1&accept-language=ar";
            var responseAr = await _httpClient.GetAsync(urlAr);
            if (responseAr.IsSuccessStatusCode)
            {
                var contentAr = await responseAr.Content.ReadAsStringAsync();
                using var docAr = JsonDocument.Parse(contentAr);
                if (docAr.RootElement.TryGetProperty("address", out var addrAr))
                {
                    streetAr = addrAr.TryGetProperty("road", out var road) ? road.GetString() : null;
                    cityAr = addrAr.TryGetProperty("city", out var city) ? city.GetString() : (addrAr.TryGetProperty("town", out var town) ? town.GetString() : (addrAr.TryGetProperty("village", out var village) ? village.GetString() : null));
                    stateAr = addrAr.TryGetProperty("state", out var state) ? state.GetString() : null;
                }
            }

            return new AddressDto
            {
                Street = streetEn,
                City = cityEn,
                State = stateEn,
                StreetAr = streetAr ?? streetEn,
                CityAr = cityAr ?? cityEn,
                StateAr = stateAr ?? stateEn
            };
        }
    }
}
