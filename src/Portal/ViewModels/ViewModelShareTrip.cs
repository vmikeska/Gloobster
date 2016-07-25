using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelShareTrip : ViewModelBase
	{
		public string Id { get; set; }
	    public List<UserViewModel> Participants { get; set; }
	    public string OwnerId { get; set; }
	    public string OwnerDisplayName { get; set; }
        public string DateRangeStr { get; set; }
        public string Message { get; set; }
        public bool TripIsPrivate { get; set; }
    }
}