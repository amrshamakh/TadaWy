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

        public async Task<UploadAiBrainScanResponseDto> AnalyzeAsync(string filePath)
        {
            int maxRetries = 3;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using var form = new MultipartFormDataContent();

                    using var stream = File.OpenRead(filePath);

                    var fileContent = new StreamContent(stream);
                    fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

                    form.Add(fileContent, "file", Path.GetFileName(filePath));

                    var response = await _httpClient.PostAsync(
                        _configuration["AiSettings:BaseUrl"],
                        form);


                    response.EnsureSuccessStatusCode();

                    var json = await response.Content.ReadAsStringAsync();

                    using var document = JsonDocument.Parse(json);

                    var description = document
                        .RootElement
                        .GetProperty("description")
                        .GetString();

                    return new UploadAiBrainScanResponseDto
                    {
                        Description = description!
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