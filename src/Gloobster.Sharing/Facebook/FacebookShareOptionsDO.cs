namespace Gloobster.Sharing.Facebook
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
	}
}