using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelTrips : ViewModelBase
	{
        public bool DisplayType { get; set; }

		public List<TripItemViewModel> NewTrips { get; set; }
        public List<TripItemViewModel> OldTrips { get; set; }
    }
}