using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddMessage(Message message)
        {
           _context.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                        .OrderByDescending(x=>x.MessageSent)
                        .AsQueryable();

                query = messageParams.Container switch 
                {
                    "Inbox" => query.Where(u=>u.RecipientUsername == messageParams.Username && !u.RecipientDeleted),
                    "Outbox" => query.Where(u=>u.SenderUsername == messageParams.Username && !u.SenderDeleted),
                    _ => query.Where(u=>u.RecipientUsername == messageParams.Username && !u.RecipientDeleted && u.DateRead == null)
                } ;  

                var messages = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider)   ;

                return await PagedList<MessageDTO>
                .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername, string RecipientUsername)
        {
           var messages = await _context.Messages
           .Include(u => u.Sender).ThenInclude(p=>p.Photos)
           .Include(u=>u.Recipient).ThenInclude(p=>p.Photos)
           .Where(
            m=>m.RecipientUsername == currentUsername && !m.RecipientDeleted &&
            m.SenderUsername == RecipientUsername ||
            m.RecipientUsername == RecipientUsername && m.SenderDeleted &&
            m.SenderUsername == currentUsername
           )
            .OrderBy(m => m.MessageSent)
            .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null &&
            m.RecipientUsername == currentUsername).ToList();

            if(unreadMessages.Any())
            {
                foreach(var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDTO>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}