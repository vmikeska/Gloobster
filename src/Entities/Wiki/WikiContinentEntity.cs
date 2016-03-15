using Gloobster.Database;
using Gloobster.Enums;

namespace Gloobster.Entities.Wiki
{
    public class WikiContinentEntity : EntityBase
    {
        public Continent Continent { get; set; }
        
        public ContinentDataSE Data { get; set; }        
    }

    public class ContinentDataSE
    {

    }
}