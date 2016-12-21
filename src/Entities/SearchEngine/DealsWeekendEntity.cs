using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.SearchEngine
{
    public class DealsWeekendEntity : EntityBase
    {
        public ObjectId User_id { get; set; }
        public int ExtraDaysLength { get; set; }
        public List<string> CountryCodes { get; set; }
        public List<int> Cities { get; set; }
    }
}