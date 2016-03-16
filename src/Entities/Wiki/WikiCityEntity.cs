using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class WikiCityEntity : WikiArticleBaseEntity
    {
        public string CountryCode { get; set; }
        
        public CityDataSE Data { get; set; }

        public List<LinkObjectSE> PlacesLinks { get; set; }
        
        public List<PriceItemSE> Prices { get; set; }     
    }

    public class CityDataSE
    {        
        public int? PopulationCity { get; set; }
        public int? PopulationMetro { get; set; }
    }

   

    
}