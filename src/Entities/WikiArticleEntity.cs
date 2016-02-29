using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    //public enum WikiArticleType { Continent, Country, City, Place, Region }

    public enum Continent { Europe, America, Africa, Antartica, SouthAmerica, NorthAmerica, Asia}

    public enum PubGoods { Beer, Wine, Whiskey, Vodka, Cigarettes}

    public class WikiCityEntity : EntityBase
    {
        public ObjectId Country_id { get; set; }
        public string CountryCode { get; set; }

        public List<LinkSE> Links { get; set; }

        public List<SectionSE> Sections { get; set; }

        public List<PhotoSE> Photos { get; set; }

        public CityDataSE Data { get; set; }

        public List<SiteSE> Sites { get; set; }

        public PubPricesSE PubPrices { get; set; }
    }

    public class PubPricesSE
    {
        public PubItemSE Beer { get; set; }
        public PubItemSE Wine { get; set; }
        public PubItemSE Whiskey { get; set; }
        public PubItemSE Vodka { get; set; }
        public PubItemSE Cigarettes { get; set; }        
    }

    public class PubItemSE
    {
        public PubPriceSE PricePub { get; set; }
        public PubPriceSE PriceBar { get; set; }
        public PubPriceSE PriceClub { get; set; }
    }

    public class PubPriceSE
    {        
        public decimal DefaultPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public List<ObjectId> Plus { get; set; }
        public List<ObjectId> Minus { get; set; }
    }
    
    public class SiteSE
    {
        public ObjectId id { get; set; }
        public string Name { get; set; }
        public List<SiteLinkSE> Links { get; set; }
    }

    public class SiteLinkSE
    {
        public SourceType Link { get; set; }
        public string SourceId { get; set; }
    }

    public class WikiArticleEntity : EntityBase
    {
        //title photo used link pattern

        //public WikiArticleType Type { get; set; }

        public ObjectId Parent_id { get; set; }
        public ObjectId Country_id { get; set; }
        public string CountryCode { get; set; }
        public Continent Continent { get; set; }


        
        public List<LinkSE> Links { get; set; }

        public List<SectionSE> Sections { get; set; }
        
        //public List<PhotoSE> Photos { get; set; }

        public ArticleDataSE Data { get; set; }
    }

    public class ArticleDataSE
    {
        
    }

    public class CityDataSE
    {
        public int PopulationCity { get; set; }
        public int PopulationMetro { get; set; }
    }

    //public class PriceSE
    //{

    //}

    //public List<PriceSE> Prices { get; set; }

    public class SectionSE
    {
        public ObjectId id { get; set; }
        
        public string Type { get; set; }
    }
    
    public class PhotoSE
    {
        public string PhotoId { get; set; }
        public string UploaderId { get; set; }
    }

    

    public enum LinkType { Facebook, WIKI}

    public class LinkSE
    {
        public LinkType Type { get; set; }
        public string Link { get; set; }
    }
}
