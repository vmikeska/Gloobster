namespace Gloobster.Common.DbEntity
{
	public class FacebookUserSE: SpecificsUserBase
	{	
		public string Link { get; set; }
		public string Locale { get; set; }		
		public int TimeZone { get; set; }
		public bool Verified { get; set; }
		public string UpdatedTime { get; set; }
		public IdNameEntity[] FavoriteTeams { get; set; }		
		
		
	}
}