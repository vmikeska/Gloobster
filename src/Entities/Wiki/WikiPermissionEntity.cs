using Gloobster.Database;
using MongoDB.Bson;
using System.Collections.Generic;

namespace Gloobster.Entities.Wiki
{
    public class WikiPermissionEntity : EntityBase
    {
        public ObjectId User_id { get; set; }

        public bool IsMasterAdmin { get; set; }
        public bool IsSuperAdmin { get; set; }

        public List<ObjectId> Articles { get; set; }
    }
}