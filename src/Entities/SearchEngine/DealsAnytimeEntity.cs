using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.SearchEngine
{
	public class DealsAnytimeEntity: EntityBase
	{
		public ObjectId User_id { get; set; }

		public List<string> CountryCodes { get; set; }
		public List<int> Cities { get; set; } 
	}
}
