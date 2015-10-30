using System;

namespace Gloobster.Portal.ViewModels
{
	public class TripItemViewModel
	{
		public string Id { get; set; }

		public string Name { get; set; }

		public bool IsLocked { get; set; }
		public string ImageBig { get; set; }

		public DateTime Date { get; set; }

		public string DisplayDateBig
		{
			get { return string.Empty; }
		}
	}
}