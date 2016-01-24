using System.Collections.Generic;

namespace Gloobster.ReqRes.Trip
{
	public class InviteRequest
	{
		public string caption { get; set; }
		public string tripId { get; set; }
		public List<string> users { get; set; }		
	}

    public class IsAdminRequest
    {
        public string id { get; set; }
        public string tripId { get; set; }
        public bool isAdmin { get; set; }
    }
}