using MongoDB.Bson;

namespace Gloobster.Common.DbEntity
{
	public class VisitedPlaceEntity: EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public float PlaceLatitude { get; set; }
		public float PlaceLongitude { get; set; }
		public string SourceId { get; set; }
		public string SourceType { get; set; }
	}
}