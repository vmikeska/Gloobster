using System.Runtime.Serialization;

namespace Gloobster.SocialLogin.Facebook.Communication
{
	[DataContract]
	public class FacebookUserFO
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }

		[DataMember(Name = "email")]
		public string Email { get; set; }

		[DataMember(Name = "first_name")]
		public string FirstName { get; set; }

		[DataMember(Name = "last_name")]
		public string LastName { get; set; }

		[DataMember(Name = "gender")]
		public string Gender { get; set; }

		[DataMember(Name = "link")]
		public string Link { get; set; }

		[DataMember(Name = "locale")]
		public string Locale { get; set; }

		[DataMember(Name = "name")]
		public string Name { get; set; }

		[DataMember(Name = "timezone")]
		public int TimeZone { get; set; }

		[DataMember(Name = "verified")]
		public bool Verified { get; set; }		

		[DataMember(Name = "updated_time")]
		public string UpdatedTime { get; set; }

		[DataMember(Name = "favorite_teams")]
		public IdNameFO[] FavoriteTeams { get; set; }

		[DataMember(Name = "hometown")]
		public IdNameFO HomeTown { get; set; }

		[DataMember(Name = "languages")]
		public IdNameFO[] Languages { get; set; }

		[DataMember(Name = "location")]
		public IdNameFO Location { get; set; }
	}

	[DataContract]
	public class IdNameFO
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }

		[DataMember(Name = "name")]
		public string Name { get; set; }
	}
}