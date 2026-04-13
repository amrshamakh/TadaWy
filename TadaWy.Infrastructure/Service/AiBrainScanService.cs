using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;
using TadaWy.Applicaation.DTO.AiDTOS;
using TadaWy.Applicaation.IService;

namespace TadaWy.Infrastructure.Service
{
    public class AiBrainScanService : IAiBrainScanService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AiBrainScanService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<BrainScanResultDto> AnalyzeAsync(string imageUrl)
        {
            int maxRetries = 3;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using var form = new MultipartFormDataContent();

                    using var stream = await _httpClient.GetStreamAsync(imageUrl);

                    var fileContent = new StreamContent(stream);
                    fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

                    form.Add(fileContent, "file", "image.jpg");

                    var response = await _httpClient.PostAsync(
                        _configuration["AiSettings:BaseUrl"],
                        form);


                    response.EnsureSuccessStatusCode();

                    var json = await response.Content.ReadAsStringAsync();

                    using var document = JsonDocument.Parse(json);

                    var root = document.RootElement;

                    return new BrainScanResultDto
                    {
                        DescriptionEn = root.GetProperty("description_en").GetString()!,
                        DescriptionAr = root.GetProperty("description_ar").GetString()!
                    };
                }
                catch (Exception ex)
                {
                    if (attempt == maxRetries)
                        throw new Exception("AI service failed after multiple attempts.", ex);

                    await Task.Delay(1000 * attempt); 
                }
            }

            throw new Exception("Unexpected error.");
        }
    }
}