namespace Gloobster.DomainObjects
{
	public class FacebookUserDO
	{
		public string Id { get; set; }
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
		public IdNameDO[] FavoriteTeams { get; set; }
		public IdNameDO HomeTown { get; set; }
		public IdNameDO[] Languages { get; set; }
		public IdNameDO Location { get; set; }
	}
}