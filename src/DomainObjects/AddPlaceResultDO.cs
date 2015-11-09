using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class AddPlaceResultDO
	{
		public NewPlacePosition Position { get; set; }

		public PlaceLiteDO Place { get; set; }

		public TravelLiteDO Travel { get; set; }
	}
}