using System;
using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
    public class MessagesViewModel : ViewModelBase
    {
        public List<UserMessage> UserMessages { get; set; }
    }


    public class MessageViewModel : ViewModelBase
    {
        public string OtherUserId { get; set; }
        public string OtherUserDisplayName { get; set; }
        public string OtherUserFirstName { get; set; }
        public string OtherUserLastName { get; set; }
    }

    public class UserMessage
    {
        public string UserId { get; set; }
        public string UserDisplayName { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }

        public string LastMessageText { get; set; }
        public DateTime Date { get; set; }
        public bool Unread { get; set; }
    }    
}