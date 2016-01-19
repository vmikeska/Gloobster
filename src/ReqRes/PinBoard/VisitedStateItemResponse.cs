using System;
using System.Collections.Generic;

namespace Gloobster.ReqRes.PinBoard
{
    public class VisitedStateItemResponse
    {
        public string PortalUserId { get; set; }
        public List<DateTime> Dates { get; set; }
        public string StateCode { get; set; }
        public int ColorId { get; set; }
        public int Count { get; set; }
    }
}