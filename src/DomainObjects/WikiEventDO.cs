using System;
using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
    public class WikiEventDO
    {
        public string Id { get; set; }
        public string ArticleId { get; set; }
        public string AddId { get; set; }
        public string Lang { get; set; }
        public EventType EventType { get; set; }
        public string Value { get; set; }
        public List<ValueDO> Values { get; set; }
        public DateTime Created { get; set; }
        public string OldValue { get; set; }
    }

    public class ValueDO
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class VersionDO
    {
        public string ArticleId { get; set; }
        public string AddId { get; set; }
        public string Lang { get; set; }
        public int Position { get; set; }
    }
}