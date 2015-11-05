using Gloobster.Common;

namespace Gloobster.DomainObjects
{
	public class SearchServiceQueryDO
	{
		public SearchServiceQueryDO()
		{
			LimitPerProvider = 10;
		}

		public string Query { get; set; }
		public int LimitPerProvider { get; set; }
		public LatLng Coordinates { get; set; }	
		public SourceType[] CustomProviders { get; set; }
		public PortalUserDO PortalUser { get; set; }

	}
}