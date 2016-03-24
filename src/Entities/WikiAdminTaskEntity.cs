using System;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    public class WikiAdminTaskEntity : EntityBase
    {
        public string Data { get; set; }

        public AdminTaskState State { get; set; }
        public AdminTaskType Type { get; set; }

        public ObjectId Target_id { get; set; }

        public ObjectId Article_id { get; set; }
        public ObjectId ResolvedBy_id { get; set; }
    }

    public class WikiReportEntity : EntityBase
    {
        public ObjectId Article_id { get; set; }
        public string Text { get; set; }
        public ObjectId Section_id { get; set; }
        public DateTime Created { get; set; }
        public ObjectId Creator_id { get; set; }
        public AdminTaskState State { get; set; }
        public string Lang { get; set; }
    }
}