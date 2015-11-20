using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class FlightSE
	{
		public ObjectId Airport_id { get; set; }		
		public string SelectedName { get; set; }
	}
}