using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.SearchEngine
{
    public class DealsCustomEntity : EntityBase
    {
        public ObjectId User_id { get; set; }

        public List<CustomSearchSE> Searches { get; set; }
    }
}