using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.ReqRes.SearchEngine8
{
    public class SearchRequest
    {
        public bool firstQuery { get; set; }
        public TimeType timeType { get; set; }
        public string customId { get; set; }

        public List<string> ccs { get; set; }
        public List<int> gids { get; set; }
        public List<string> qids { get; set; }

    }
}
