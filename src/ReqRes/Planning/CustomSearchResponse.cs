using System;
using System.Collections.Generic;
using Gloobster.ReqRes.Airport;
using Gloobster.Common;

namespace Gloobster.ReqRes.Planning
{
    public class PlanningCustomResponse
    {
        public List<CustomSearchHeaderResponse> headers { get; set; }
        public CustomSearchResponse first { get; set; }
    }

    public class CustomSearchHeaderResponse
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class CustomSearchResponse
    {
        public string id { get; set; }

        public string name { get; set; }

        public int daysFrom { get; set; }
        public int daysTo { get; set; }

        public List<string> ccs { get; set; }
        public List<int> gids { get; set; }

        public Date deparature { get; set; }
        public Date arrival { get; set; }

        public bool standardAirs { get; set; }
        public List<FromAirResponse> customAirs { get; set; }

        public int freq { get; set; }
        public DateTime? lastNewsletter { get; set; }

        public bool started { get; set; }
    }

    public class FromAirResponse
    {
        public string text { get; set; }
        public int origId { get; set; }
    }
}