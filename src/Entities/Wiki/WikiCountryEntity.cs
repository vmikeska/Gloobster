using System.Collections.Generic;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class WikiCountryEntity : WikiArticleBaseEntity
    {        
        public Continent Continent { get; set; }
        public string CountryCode { get; set; }        
    }
    
    public enum ArticleDataType { String, Bool, Int, Decimal}

    public class ArticleDataSE
    {
        public ObjectId id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public List<string> Values { get; set; }
        
        public ArticleDataType DataType { get;set;}
        public string ListCategory { get; set; }
    }

    

   
    
   
}
