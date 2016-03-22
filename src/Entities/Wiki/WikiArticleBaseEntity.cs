using System;
using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class WikiArticleBaseEntity : EntityBase
    {
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        
        public List<LinkSE> Links { get; set; }

        public int GID { get; set; }

        public List<SectionSE> Sections { get; set; }

        public bool HasTitlePhoto { get; set; }

        public List<WikiPhotoSE> Photos { get; set; }

        public List<ObjectId> Dos { get; set; }
        public List<ObjectId> Donts { get; set; }

        public List<ArticleDataSE> Data { get; set; }
    }
}