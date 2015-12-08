namespace Gloobster.DomainObjects
{
	public class FacebookShareOptionsDO
	{
		//1. caption above the photo
		public string Message { get; set; }
		//2. photo link
		public string Picture { get; set; }
		//3. title of description
		public string Name { get; set; }
		//4. description of the thing
		public string Description { get; set; }
		//5. an another caption bellow
		public string Caption { get; set; }
		// target link
		public string Link { get; set; }

		public FacebookPrivacyDO Privacy { get; set; }
	}

	public class FacebookPrivacyDO
	{
		//Text that describes the privacy settings, as they would appear on Facebook.
		public string Description { get; set; }

		//The actual privacy setting.
		public FacebookPrivacyLevel Value { get; set; }

		//If value is CUSTOM, this indicates which group of friends can see the post.
		public FacebookCustomPrivacyLevel? Friends { get; set; }

		//If value is CUSTOM, this is a comma-separated ID list of users and friendlists(if any) that can see the post.
		public string Allow { get; set; }

		//If value is CUSTOM, this is a comma-separated ID list of users and friendlists (if any) that cannot see the post.
		public string Deny { get; set; }
	}

	public enum FacebookPrivacyLevel
	{
		EVERYONE,
		ALL_FRIENDS,
		FRIENDS_OF_FRIENDS,
		SELF,
		CUSTOM
	}

	public enum FacebookCustomPrivacyLevel
	{
		ALL_FRIENDS,
		FRIENDS_OF_FRIENDS,
		SOME_FRIENDS
	}
	
}