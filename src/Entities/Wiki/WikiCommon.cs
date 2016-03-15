using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class LinkItemSE
    {
        public ObjectId id { get;set; }
        public SourceType Type { get; set; }
        public string SourceId { get; set; }
    }

    //public enum WikiArticleType { Continent, Country, City, Place, Region }

    public enum Continent { Europe, Australia, Africa, Antarctica, SouthAmerica, NorthAmerica, Asia }
    
    public enum LinkType { Facebook, WIKI }

    public class LinkSE
    {
        public LinkType Type { get; set; }
        public string Link { get; set; }
    }

    public class SectionSE
    {
        public ObjectId id { get; set; }

        public string Type { get; set; }
    }
}
