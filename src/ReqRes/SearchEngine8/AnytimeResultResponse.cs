using System.Collections.Generic;

namespace Gloobster.ReqRes.SearchEngine8
{
    public class AnytimeResultResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public int gid { get; set; }
        public string name { get; set; }
        public string cc { get; set; }

        public List<FlightResponse> fs { get; set; }
    }
}