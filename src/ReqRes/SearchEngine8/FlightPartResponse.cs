using System;

namespace Gloobster.ReqRes.SearchEngine8
{
    public class FlightPartResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public DateTime dep { get; set; }
        public DateTime arr { get; set; }

        public string air { get; set; }
        public int no { get; set; }

        public int mins { get; set; }
    }
}
