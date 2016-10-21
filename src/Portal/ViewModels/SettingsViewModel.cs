using System.Collections.Generic;
using Gloobster.Entities;
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
        public string DisplayedUserId { get; set; }

        public string AvatarLink { get; set; }

        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string HomeLocation { get; set; }
        public string CurrentLocation { get; set; }

        public string Gender { get; set; }

        public int? BirthYear { get; set; }
        public FamilyStatus FamilyStatus { get; set; }

        public List<string> Languages { get; set; }
        public List<int> Interests { get; set; }

        public string ShortDescription { get; set; }

        public string GetFamilyStatusStr(FamilyStatus fs)
        {
            return fs.ToString();
        }

        public List<UserRatingVM> Ratings { get; set; }

        public int Cities { get; set; }
        public int Countries { get; set; }
        public int Places { get; set; }
    }

    public class UserRatingVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public string Text { get; set; }
    }
}