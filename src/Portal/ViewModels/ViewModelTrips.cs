using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelTrips : ViewModelBase
	{
		public List<TripItemViewModel> Trips { get; set; }

        public List<TripItemViewModel> InvitedTrips { get; set; }        
	}
}