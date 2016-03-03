using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    public class WikiTextsEntity : EntityBase
    {
        public ObjectId Article_id { get; set; }
        public string Language { get; set; }

        public SectionTextsCommonSE BaseTexts { get; set; }

        public List<SectionTextsSE> Texts { get; set; }

        public List<DoDontTextSE> DoDontTexts { get; set; }
        
        public string LinkName { get; set; }
    }

    public class DoDontTextSE
    {
        public ObjectId DoDont_id { get; set; }

        public string Text { get; set; }

        public List<ObjectId> Likes { get; set; }
        public List<ObjectId> Dislikes { get; set; }
    }

    public class SectionTextsSE
    {
        public ObjectId Section_id { get; set; }

        public string Text { get; set; } 

        public List<ObjectId> Likes { get; set; }
        public List<ObjectId> Dislikes { get; set; }
    }

    public class SectionTextsCommonSE : SectionTextsSE
    {
        public string Title { get; set; }
        public string BaseText { get; set; }
    }

    public class SectionTextsBlockSE : SectionTextsSE
    {
        public string Title { get; set; }
        public string Content { get; set; }
    }

    public class SectionTextsDoDontSE : SectionTextsSE
    {
        //public string Text { get; set; }
    }
}
