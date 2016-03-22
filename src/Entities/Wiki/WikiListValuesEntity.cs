using System.Collections.Generic;
using Gloobster.Database;

namespace Gloobster.Entities.Wiki
{
    public class WikiListValuesEntity : EntityBase
    {
        public string ListCategory { get; set; }
        public List<WikiListValueSE> Items { get; set; }
    }

    public class WikiListValueSE
    {
        public string Id { get; set; }
        public string Name { get; set; }        
        public bool Translate { get; set; }
    }
}