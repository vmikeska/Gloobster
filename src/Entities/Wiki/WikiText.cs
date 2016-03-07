using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    public class WikiTextsEntity : EntityBase
    {
        public ObjectId Article_id { get; set; }
        public ArticleType Type { get; set; }

        public string Language { get; set; }
        
        public List<SectionTextsSE> Texts { get; set; }
        
        public string Title { get; set; }
        public string LinkName { get; set; }
    }
    
    public class SectionTextsSE
    {
        public ObjectId Section_id { get; set; }

        public string Text { get; set; } 

        public List<ObjectId> Likes { get; set; }
        public List<ObjectId> Dislikes { get; set; }
    }
    
}
