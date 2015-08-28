namespace Gloobster.Common.DbEntity
{
	public class FacebookUserEntity
	{	
		public string UserId { get; set; }	
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Gender { get; set; }
		public string Link { get; set; }
		public string Locale { get; set; }
		public string Name { get; set; }
		public int TimeZone { get; set; }
		public bool Verified { get; set; }
		public string UpdatedTime { get; set; }
		public IdNameEntity[] FavoriteTeams { get; set; }		
		public IdNameEntity HomeTown { get; set; }
		public IdNameEntity[] Languages { get; set; }
		public IdNameEntity Location { get; set; }
	}
}