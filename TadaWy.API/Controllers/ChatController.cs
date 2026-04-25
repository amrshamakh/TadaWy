using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TadaWy.Applicaation.DTO.ChatDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Infrastructure.Service;

namespace TadaWy.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatAppService _chatService;
        private readonly ICloudinaryService _cloudinaryService;

        public ChatController(IChatAppService chatService, ICloudinaryService cloudinaryService)
        {
            _chatService = chatService;
            _cloudinaryService = cloudinaryService;
        }

        ///////////////////////////////////////////////
        ///////////////SEND MESSAGE////////////////////
        ///////////////////////////////////////////////
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var result = await _chatService.SendMessageAsync(userId, dto);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
        ///////////////////////////////////////////////
        //////////////Upload Image/////////////////////
        ///////////////////////////////////////////////

        [HttpPost("upload-image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] UploadChatImageDto request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is required.");

            var imageUrl = await _cloudinaryService
                .UploadFileAsync(request.File, "ChatImages");

            return Ok(new { imageUrl });
        }


        ///////////////////////////////////////////////
        //////////CHAT HISTORY/////////////////////////
        ///////////////////////////////////////////////
        [HttpGet("history")]
        public async Task<IActionResult> GetChatHistory(
            [FromQuery] string otherUserId,
            [FromQuery] DateTime? lastCreatedAt)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _chatService
                .GetChatHistoryAsync(userId, otherUserId, lastCreatedAt);

            return Ok(result);
        }

        /////////////////////////////////////////////////
        ////////////CONVERSATIONS (chat list)////////////
        /////////////////////////////////////////////////
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] string? search)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _chatService
                .GetConversationsAsync(userId, search);

            return Ok(result);
        }

        ///////////////////////////////////////////////
        /////////////////MARK AS SEEN /////////////////
        ///////////////////////////////////////////////
        [HttpPost("mark-as-seen")]
        public async Task<IActionResult> MarkAsSeen([FromQuery] string otherUserId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _chatService.MarkMessagesAsSeenAsync(userId, otherUserId);

            return Ok();
        }
    }
}