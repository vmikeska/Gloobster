using System;
using System.Threading.Tasks;

namespace Gloobster.DomainModels.Services.Facebook.FriendsExtractor
{
	public class FacebookUser
	{
		public string name { get; set; }
		public string id { get; set; }
	}

	public class Paging
	{
		public string next { get; set; }
	}

	public class Summary
	{
		public int total_count { get; set; }
	}

	public class FacebookFriendsResponse
	{
		public FacebookUser[] data { get; set; }
		public Paging paging { get; set; }
		public Summary summary { get; set; }
	}

}
