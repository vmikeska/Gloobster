using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class WikiCountryEntity : WikiArticleBaseEntity
    {        
        public Continent Continent { get; set; }
        public string CountryCode { get; set; }

        public CountryDataSE Data { get; set; }

        public List<ObjectId> Dos { get; set; }
        public List<ObjectId> Donts { get; set; }
        
    }

    public class CountryDataSE
    {
        public ReligionType Religion { get; set; }        
        public int Population { get; set; }
        public double Area { get; set; }
        public string CapitalName { get; set; }
        public int CapitalId { get; set; }
        public List<string> Languages { get; set; }
        public HDI HDI { get; set; }
        public string CallingCode { get; set; }
        public bool DrivingRight { get; set; }
        public string CurrencyCode {get;set;}
        public string CurrencyName { get; set; }
        public List<string> MemberOf { get; set; }
        public SocketType SocketType { get; set; }
    }

   
    
   
}
