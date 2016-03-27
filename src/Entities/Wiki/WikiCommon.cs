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
    
    public class LinkSE
    {
        public ObjectId id { get; set; }
        public LinkType Type { get; set; }
        public string SID { get; set; }
        public string Link { get; set; }
    }

    public class SectionSE
    {
        public ObjectId id { get; set; }

        public string Type { get; set; }
    }

    public class WikiPhotoSE
    {
        public ObjectId id { get; set; }
        public ObjectId Owner_id { get; set; }
        public bool Confirmed { get; set; }
        public DateTime Inserted { get; set; }
        public string Description { get; set; }
    }

    public class LinkObjectSE
    {
        public ObjectId id { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public List<LinkItemSE> Links { get; set; }
    }

    public class PriceItemSE
    {
        public ObjectId id { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public string Type { get; set; }
        public PriceSE Price { get; set; }
    }

    public class PriceSE
    {
        public decimal DefaultPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public List<ObjectId> Plus { get; set; }
        public List<ObjectId> Minus { get; set; }
        public bool Initialized { get; set; }
    }
}
