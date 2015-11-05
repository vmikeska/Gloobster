using System.Collections.Generic;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelTripDetail : ViewModelBase
	{
		public string TripId { get; set; }

		public string OwnerDisplayName { get; set; }

		public string Name { get; set; }
		public string Description { get; set; }
		public string Notes { get; set; }

		public bool NotesPublic { get; set; }

		public List<TripParticipantViewModel> Participants { get; set; }

		public bool IsUserAdmin { get; set; }

	}
}