using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
    public class WikiPermissionsViewModel : ViewModelBase
    {
        public List<UserViewModel> MasterAdmins { get; set; }
        public List<UserViewModel> SuperAdmins { get; set; }

        public List<UserPermVM> Users { get; set; }
    }

    public class UserPermVM
    {
        public string Name { get; set; }
        public string UserId { get; set; }

        public List<PermItemVM> Items { get; set; }
    }

    public class PermItemVM
    {
        public string WikiId { get; set; }
        public string Name { get; set; }
    }
}