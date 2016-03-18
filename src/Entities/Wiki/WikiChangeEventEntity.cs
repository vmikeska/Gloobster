using System;
using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.Wiki
{
    public class WikiChangeEventEntity : EntityBase
    {
        public ObjectId Article_id { get; set; }
        public string AddId { get; set; }
        public string Lang { get; set; }
        public EventType EventType { get; set; }
        public string Value { get; set; }
        public List<ValueSE> Values { get; set; }
        public DateTime Created { get; set; }
        public string OldValue { get; set; }
    }

    public class ValueSE
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}