using System.Collections.Generic;

namespace Gloobster.ReqRes.SearchEngine8
{
    public class FlightResponse
    {
        public string from { get; set; }
        public string to { get; set; }

        public double price { get; set; }
        public double score { get; set; }

        public double hrs { get; set; }
        public int days { get; set; }

        public string bl { get; set; }

        public List<FlightPartResponse> parts { get; set; }
    }
}