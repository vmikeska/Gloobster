using MongoDB.Bson;

namespace Gloobster.Common.DbEntity
{
	public class VisitedCountryEntity : EntityBase
	{
		public ObjectId PortalUser_id { get; set; }
		public string CountryCode2 { get; set; }
	}
}