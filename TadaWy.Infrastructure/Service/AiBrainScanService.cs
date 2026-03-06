using System.Net.Http.Headers;
using System.Text.Json;
using TadaWy.Applicaation.DTO.AiDTOS;
using TadaWy.Applicaation.IService;

namespace TadaWy.Infrastructure.Service
{
    public class AiBrainScanService : IAiBrainScanService
    {
        private readonly HttpClient _httpClient;

        public AiBrainScanService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<UploadAiBrainScanResponseDto> AnalyzeAsync(string filePath)
        {
            using var form = new MultipartFormDataContent();

            using var stream = File.OpenRead(filePath);

            var fileContent = new StreamContent(stream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

            form.Add(fileContent, "file", Path.GetFileName(filePath));

            var response = await _httpClient.PostAsync(
                "https://omarahmed176-alzheimer-detection-api.hf.space/predict/",
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
    }
}