using System.Collections.Generic;
using Gloobster.Enums.SearchEngine;

namespace Gloobster.ReqRes.SearchEngine8
{
    public class FlightQueryResultResponse<T, TY>
    {
        public string qid { get; set; }
        public QueryState state { get; set; }

        public string from { get; set; }

        public string to { get; set; }
        public PlaceType toType { get; set; }
        public string toName { get; set; }

        public string prms { get; set; }

        public List<TY> results { get; set; }
    }
}