using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
    public class TravelBViewModel : ViewModelBase
    {
        public List<string> Languages { get; set; }
    }

    public class TravelBManagementViewModel : ViewModelBase
    {

    }

    public class MessageViewModel : ViewModelBase
    {
        public string OtherUserId { get; set; }
        public string OtherUserDisplayName { get; set; }
        public string OtherUserFirstName { get; set; }
        public string OtherUserLastName { get; set; }
    }
}