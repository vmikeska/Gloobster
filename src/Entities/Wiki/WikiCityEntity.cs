using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class WikiCityEntity : WikiArticleBaseEntity
    {
        public string CountryCode { get; set; }
        
        public List<LinkObjectSE> PlacesLinks { get; set; }
        
        public List<PriceItemSE> Prices { get; set; }     
    }    
}