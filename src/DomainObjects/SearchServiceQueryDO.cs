using Gloobster.Common;
using Gloobster.Enums;

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
	    public bool MustHaveCity = false;
        public bool MustHaveCountry = false;
        public string FbToken { get; set; }
    }
}