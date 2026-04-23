using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.ChatDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class ChatAppService : IChatAppService
    {
        private readonly TadaWyDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ChatAppService(
            TadaWyDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        ////////////////////////////////////////////
        ///////////// SEND MESSAGE//////////////////
        ////////////////////////////////////////////
        public async Task<MessageDto> SendMessageAsync(string senderUserId, SendMessageDto dto)
        {
            // Validate sender
            var sender = await _userManager.FindByIdAsync(senderUserId);
            if (sender == null)
                throw new UnauthorizedAccessException("Invalid sender.");

            // Validate receiver
            var receiver = await _userManager.FindByIdAsync(dto.ReceiverUserId);
            if (receiver == null)
                throw new ArgumentException("Receiver not found.");

            // Validate content
            if (string.IsNullOrWhiteSpace(dto.Content) && string.IsNullOrWhiteSpace(dto.ImageUrl))
                throw new ArgumentException("Message must contain text or image.");

            // Check if appointment exists
            var hasAppointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .AnyAsync(a =>
                    a.Patient.UserID == senderUserId && a.Doctor.UserID == dto.ReceiverUserId ||
                    a.Patient.UserID == dto.ReceiverUserId && a.Doctor.UserID == senderUserId
                );

            if (!hasAppointment)
                throw new UnauthorizedAccessException("Chat allowed only after appointment.");

            // Save message
            var message = new Message
            {
                SenderUserId = senderUserId,
                ReceiverUserId = dto.ReceiverUserId,
                Content = dto.Content,
                ImageUrl = dto.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                IsSeen = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Response DTO
            return new MessageDto
            {
                Id = message.Id,
                SenderUserId = message.SenderUserId,
                ReceiverUserId = message.ReceiverUserId,
                Content = message.Content,
                ImageUrl = message.ImageUrl,
                CreatedAt = message.CreatedAt,
                IsSeen = message.IsSeen
            };
        }

        //////////////////////////////////////////////
        //////CHAT HISTORY (INFINITE SCROLL)//////////
        //////////////////////////////////////////////
        public async Task<List<MessageDto>> GetChatHistoryAsync(string userId, string otherUserId, DateTime? lastCreatedAt)
        {
            var query = _context.Messages
                .Where(m =>
                    (m.SenderUserId == userId && m.ReceiverUserId == otherUserId) ||
                    (m.SenderUserId == otherUserId && m.ReceiverUserId == userId)
                );

            if (lastCreatedAt.HasValue)
            {
                query = query.Where(m => m.CreatedAt < lastCreatedAt.Value);
            }

            var messages = await query
                .OrderByDescending(m => m.CreatedAt)
                .Take(21)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    SenderUserId = m.SenderUserId,
                    ReceiverUserId = m.ReceiverUserId,
                    Content = m.Content,
                    ImageUrl = m.ImageUrl,
                    CreatedAt = m.CreatedAt,
                    IsSeen = m.IsSeen
                })
                .ToListAsync();

            var hasMore = messages.Count > 20;

            if (hasMore)
                messages.RemoveAt(20);

            messages.Reverse();

            return messages;
        }

        ////////////////////////////////////
        //////CONVERSATIONS (CHAT LIST)/////
        /////////////////////////////////////
        public async Task<List<ConversationDto>> GetConversationsAsync(string userId)
        {
            // 1️⃣ Check if user is Patient or Doctor
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserID == userId);

            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserID == userId);

            var conversations = new List<ConversationDto>();


            // PATIENT → GET DOCTORS

            if (patient != null)
            {
                var doctors = await _context.Appointments
                    .Where(a => a.Patient.UserID == userId)
                    .Select(a => a.Doctor)
                    .Distinct()
                    .ToListAsync();

                foreach (var doc in doctors)
                {
                    var lastMessage = await _context.Messages
                        .Where(m =>
                            (m.SenderUserId == userId && m.ReceiverUserId == doc.UserID) ||
                            (m.SenderUserId == doc.UserID && m.ReceiverUserId == userId)
                        )
                        .OrderByDescending(m => m.CreatedAt)
                        .FirstOrDefaultAsync();

                    conversations.Add(new ConversationDto
                    {
                        UserId = doc.UserID,
                        FullName = $"{doc.FirstName} {doc.LastName}",
                        ImageUrl = doc.ImageUrl,
                        LastMessage = lastMessage?.Content ?? (lastMessage?.ImageUrl != null ? "Image" : null),
                        LastMessageDate = lastMessage?.CreatedAt,
                        IsSeen = lastMessage?.IsSeen ?? true
                    });
                }
            }


            // DOCTOR → GET PATIENTS
            else if (doctor != null)
            {
                var patients = await _context.Appointments
                    .Where(a => a.Doctor.UserID == userId)
                    .Select(a => a.Patient) 
                    .Distinct()
                    .ToListAsync();

                foreach (var pat in patients)
                {
                    var lastMessage = await _context.Messages
                        .Where(m =>
                            (m.SenderUserId == userId && m.ReceiverUserId == pat.UserID) ||
                            (m.SenderUserId == pat.UserID && m.ReceiverUserId == userId)
                        )
                        .OrderByDescending(m => m.CreatedAt)
                        .FirstOrDefaultAsync();

                    conversations.Add(new ConversationDto
                    {
                        UserId = pat.UserID,
                        FullName = $"{pat.FirstName} {pat.LastName}",
                        ImageUrl = null, 
                        LastMessage = lastMessage?.Content ?? (lastMessage?.ImageUrl != null ? "Image" : null),
                        LastMessageDate = lastMessage?.CreatedAt,
                        IsSeen = lastMessage?.IsSeen ?? true
                    });
                }
            }

            // Order conversations by last message date
            conversations = conversations
                .OrderByDescending(c => c.LastMessageDate ?? DateTime.MinValue)
                .ToList();

            return conversations;
        }
    }
}
