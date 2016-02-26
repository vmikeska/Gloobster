using System;
using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
	public class TripItemViewModel
	{
		public string Id { get; set; }

		public string Name { get; set; }

		public bool IsLocked { get; set; }

        public bool IsOwner { get; set; }
        public string OwnerName { get; set; }
        public string OwnerId { get; set; }

        public bool HasSmallPicture { get; set; }

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public List<UserViewModel> Participants { get; set; }

        public string DisplayDateBig
		{
			get { return string.Empty; }
		}
	}

    public class UserViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}