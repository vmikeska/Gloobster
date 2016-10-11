using System;
using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.TravelB
{
    public class MessageEntity : EntityBase
    {
        public List<ObjectId> UserIds { get; set; }

        public List<MessageSE> Messages { get; set; }
    }

    public class MessageSE
    {
        public ObjectId id { get; set; }
        public ObjectId User_id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public bool Read { get; set; }
    }
}