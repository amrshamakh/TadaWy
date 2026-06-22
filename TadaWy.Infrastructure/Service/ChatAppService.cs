using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.ChatDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class ChatAppService : IChatAppService
    {
        private readonly TadaWyDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly INotificationService _notificationService;

        public ChatAppService(
            TadaWyDbContext context,
            UserManager<ApplicationUser> userManager,
            INotificationService notificationService)
        {
            _context = context;
            _userManager = userManager;
            _notificationService = notificationService;
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


            if (string.IsNullOrWhiteSpace(dto.Content) && string.IsNullOrWhiteSpace(dto.ImageUrl))
                throw new ArgumentException("Message must contain text or image.");

            // Upload image if exists
            string? imageUrl = dto.ImageUrl;


            // Check if appointment exists
            var hasAppointment = await _context.Appointments
                .AnyAsync(a =>
                    (a.PatientId == senderUserId && a.Doctor.UserID == dto.ReceiverUserId) ||
                    (a.PatientId == dto.ReceiverUserId && a.Doctor.UserID == senderUserId)
                );

            if (!hasAppointment)
                throw new UnauthorizedAccessException("Chat allowed only after appointment.");

            // Save message
            var message = new Message
            {
                SenderUserId = senderUserId,
                ReceiverUserId = dto.ReceiverUserId,
                Content = dto.Content,
                ImageUrl = imageUrl,
                CreatedAt = DateTime.UtcNow,
                IsSeen = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // --- Notification Logic ---
            var doctorReceiver = await _context.Doctors.FirstOrDefaultAsync(d => d.UserID == dto.ReceiverUserId);
            if (doctorReceiver != null)
            {
                // Receiver is a Doctor
                var totalUnread = await GetTotalUnreadCount(dto.ReceiverUserId);
                await _notificationService.SendNotificationAsync(
                    dto.ReceiverUserId,
                    "New Messages",
                    "رسائل جديدة",
                    $"You have {totalUnread} new messages.",
                    $"لديك {totalUnread} رسائل جديدة.",
                    NotificationType.ChatMessage
                );
            }
            else
            {
                // Receiver is likely a Patient, sender is a Doctor
                var doctorSender = await _context.Doctors.FirstOrDefaultAsync(d => d.UserID == senderUserId);
                
                var senderNameEn = doctorSender != null ? $"Dr. {doctorSender.FirstNameEn} {doctorSender.LastNameEn}" : "New Message";
                var senderNameAr = doctorSender != null ? $"د. {doctorSender.FirstNameAr} {doctorSender.LastNameAr}" : "رسالة جديدة";
                
                var previewEn = !string.IsNullOrEmpty(message.Content) ? message.Content : "Sent an image";
                var previewAr = !string.IsNullOrEmpty(message.Content) ? message.Content : "أرسل صورة";

                await _notificationService.SendNotificationAsync(
                    dto.ReceiverUserId,
                    senderNameEn,
                    senderNameAr,
                    previewEn,
                    previewAr,
                    NotificationType.ChatMessage
                );
            }

            // Response DTO
            return new MessageDto
            {
                Id = message.Id,
                SenderUserId = message.SenderUserId,
                ReceiverUserId = message.ReceiverUserId,
                Content = message.Content,
                ImageUrl = message.ImageUrl,
                CreatedAt = message.CreatedAt,
                IsSeen = message.IsSeen,
                Type = message.ImageUrl != null ? "image" : "text"
            };
        }

        //////////////////////////////////////////////
        //////CHAT HISTORY (INFINITE SCROLL)//////////
        //////////////////////////////////////////////
        public async Task<ChatHistoryResponseDto> GetChatHistoryAsync(string userId, string otherUserId, DateTime? lastCreatedAt)
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
                    IsSeen = m.IsSeen,
                    Type = m.ImageUrl != null ? "image" : "text"
                })
                .ToListAsync();

            var hasMore = messages.Count > 20;

            if (hasMore)
                messages.RemoveAt(20);

            messages.Reverse();

            return new ChatHistoryResponseDto
            {
                Items = messages,
                HasMore = hasMore
            };
        }

        ////////////////////////////////////
        //////CONVERSATIONS (CHAT LIST)/////
        /////////////////////////////////////
        public async Task<List<ConversationDto>> GetConversationsAsync(string userId, string? search)
        {
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            // Check if user is Patient or Doctor
            var patient = await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserID == userId);

            var doctor = await _context.Doctors
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.UserID == userId);

            var conversations = new List<ConversationDto>();


            // PATIENT => GET DOCTORS

            if (patient != null)
            {
                var doctorUserIds = await _context.Appointments
                    .Where(a => a.PatientId == userId)
                    .Select(a => a.Doctor.UserID)
                    .Distinct()
                    .ToListAsync();

                // Server-side: get last message + unread count per conversation partner
                var conversationSummaries = await _context.Messages
                    .Where(m =>
                        (m.SenderUserId == userId && doctorUserIds.Contains(m.ReceiverUserId)) ||
                        (doctorUserIds.Contains(m.SenderUserId) && m.ReceiverUserId == userId)
                    )
                    .GroupBy(m => m.SenderUserId == userId ? m.ReceiverUserId : m.SenderUserId)
                    .Select(g => new
                    {
                        OtherUserId = g.Key,
                        LastMessageContent = g.OrderByDescending(m => m.CreatedAt).Select(m => m.Content).FirstOrDefault(),
                        LastMessageImageUrl = g.OrderByDescending(m => m.CreatedAt).Select(m => m.ImageUrl).FirstOrDefault(),
                        LastMessageDate = g.Max(m => m.CreatedAt),
                        LastMessageIsSeen = g.OrderByDescending(m => m.CreatedAt).Select(m => m.IsSeen).FirstOrDefault(),
                        UnreadCount = g.Count(m => m.SenderUserId != userId && !m.IsSeen)
                    })
                    .ToListAsync();

                var summaryDict = conversationSummaries.ToDictionary(s => s.OtherUserId);

                //Get doctors in ONE query
                var doctors = await _context.Doctors
                    .AsNoTracking()
                    .Include(d => d.Specialization)
                    .Where(d => doctorUserIds.Contains(d.UserID))
                    .ToListAsync();

                foreach (var doc in doctors)
                {
                    var fullNameEn = $"{doc.FirstNameEn} {doc.LastNameEn}";
                    var fullNameAr = $"{doc.FirstNameAr} {doc.LastNameAr}";
                    var fullName = isArabic ? fullNameAr : fullNameEn;

                    if (!string.IsNullOrEmpty(search) &&
                        !fullName.ToLower().Contains(search.ToLower()))
                        continue;

                    summaryDict.TryGetValue(doc.UserID, out var summary);

                    conversations.Add(new ConversationDto
                    {
                        UserId = doc.UserID,
                        FullName = fullName,
                        ImageUrl = doc.ImageUrl,
                        SpecializationName = isArabic ? doc.Specialization.NameAr : doc.Specialization.NameEn,
                        LastMessage = summary?.LastMessageContent ?? (summary?.LastMessageImageUrl != null ? (isArabic ? "صورة" : "Image") : null),
                        LastMessageDate = summary?.LastMessageDate,
                        IsSeen = summary?.LastMessageIsSeen ?? true,
                        UnreadCount = summary?.UnreadCount ?? 0
                    });
                }
            }


            // DOCTOR => GET PATIENTS
            else if (doctor != null)
            {
                var patientUserIds = await _context.Appointments
                    .Where(a => a.Doctor.UserID == userId)
                    .Select(a => a.PatientId)
                    .Distinct()
                    .ToListAsync();

                // Server-side: get last message + unread count per conversation partner
                var conversationSummaries = await _context.Messages
                    .Where(m =>
                        (m.SenderUserId == userId && patientUserIds.Contains(m.ReceiverUserId)) ||
                        (patientUserIds.Contains(m.SenderUserId) && m.ReceiverUserId == userId)
                    )
                    .GroupBy(m => m.SenderUserId == userId ? m.ReceiverUserId : m.SenderUserId)
                    .Select(g => new
                    {
                        OtherUserId = g.Key,
                        LastMessageContent = g.OrderByDescending(m => m.CreatedAt).Select(m => m.Content).FirstOrDefault(),
                        LastMessageImageUrl = g.OrderByDescending(m => m.CreatedAt).Select(m => m.ImageUrl).FirstOrDefault(),
                        LastMessageDate = g.Max(m => m.CreatedAt),
                        LastMessageIsSeen = g.OrderByDescending(m => m.CreatedAt).Select(m => m.IsSeen).FirstOrDefault(),
                        UnreadCount = g.Count(m => m.SenderUserId != userId && !m.IsSeen)
                    })
                    .ToListAsync();

                var summaryDict = conversationSummaries.ToDictionary(s => s.OtherUserId);

                // Get patients in one query
                var patients = await _context.Patients
                    .AsNoTracking()
                    .Where(p => patientUserIds.Contains(p.UserID))
                    .ToListAsync();

                foreach (var pat in patients)
                {
                    var fullName = $"{pat.FirstName} {pat.LastName}";

                    if (!string.IsNullOrEmpty(search) &&
                        !fullName.ToLower().Contains(search.ToLower()))
                        continue;

                    summaryDict.TryGetValue(pat.UserID, out var summary);

                    conversations.Add(new ConversationDto
                    {
                        UserId = pat.UserID,
                        FullName = fullName,
                        ImageUrl = null,
                        SpecializationName = null,
                        LastMessage = summary?.LastMessageContent ?? (summary?.LastMessageImageUrl != null ? (isArabic ? "صورة" : "Image") : null),
                        LastMessageDate = summary?.LastMessageDate,
                        IsSeen = summary?.LastMessageIsSeen ?? true,
                        UnreadCount = summary?.UnreadCount ?? 0
                    });
                }
            }

            // Order conversations by last message date
            conversations = conversations
                .OrderByDescending(c => c.LastMessageDate ?? DateTime.MinValue)
                .ToList();

            return conversations;
        }


        ////////////////////////////////////////
        ///unread Count For real time///////////
        ////////////////////////////////////////

        public async Task<int> GetUnreadCount(string userId, string fromUserId)
        {
            return await _context.Messages
                .CountAsync(m =>
                    m.SenderUserId == fromUserId &&
                    m.ReceiverUserId == userId &&
                    !m.IsSeen
                );
        }

        public async Task<int> GetTotalUnreadCount(string userId)
        {
            return await _context.Messages
                .CountAsync(m =>
                    m.ReceiverUserId == userId &&
                    !m.IsSeen
                );
        }

        ////////////////////////////////////////
        ///Seen Messages (Mark as Seen)/////////
        ////////////////////////////////////////
        public async Task MarkMessagesAsSeenAsync(string userId, string otherUserId)
        {            // Bulk update — no data loading needed
            await _context.Messages
                .Where(m =>
                    m.SenderUserId == otherUserId &&
                    m.ReceiverUserId == userId &&
                    !m.IsSeen
                )
                .ExecuteUpdateAsync(m => m.SetProperty(x => x.IsSeen, true));
        }
    }
}
