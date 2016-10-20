using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.Portal.ViewModels
{
	public class SettingsViewModel: ViewModelBase
	{
		public string AvatarLink { get; set; }

        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string HomeLocation { get; set; }
		public string CurrentLocation { get; set; }
		public string Gender { get; set; }
        public Gender GenderVal { get; set; }

        public int? BirthYear { get; set; }
        public string FamilyStatus { get; set; }

        public List<string> Languages { get; set; }
        public List<int> Interests { get; set; }

        public string ShortDescription { get; set; }


    }






    public class UserDetailViewModel : ViewModelBase
    {
        public string AvatarLink { get; set; }
        public string DisplayName { get; set; }
        public string HomeLocation { get; set; }
        public string CurrentLocation { get; set; }
        public string Gender { get; set; }
    }
}