using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class WikiCityEntity : EntityBase
    {
        public ObjectId Country_id { get; set; }

        public int GID { get; set; }
        
        public List<LinkSE> Links { get; set; }

        public List<SectionSE> Sections { get; set; }

        public List<PhotoSE> Photos { get; set; }

        public CityDataSE Data { get; set; }

        public List<LinkObjectSE> PlacesLinks { get; set; }
        
        public List<PriceItemSE> Prices { get; set; }
        
        public List<ObjectId> Dos { get; set; }

        public List<ObjectId> Donts { get; set; }

        public bool HasTitlePhoto { get; set; }
    }

    public class CityDataSE
    {
        public string CountryCode { get; set; }
        public int PopulationCity { get; set; }
        public int PopulationMetro { get; set; }
    }

    public class LinkObjectSE
    {
        public ObjectId id { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public List<LinkItemSE> Links { get; set; }
    }
    
    //public class PubItemSE
    //{
    //    public string Type { get; set; }
    //    public string Category { get; set; }

    //    public PriceSE PricePub { get; set; }
    //    public PriceSE PriceBar { get; set; }
    //    public PriceSE PriceClub { get; set; }
    //}

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
    }

    
}