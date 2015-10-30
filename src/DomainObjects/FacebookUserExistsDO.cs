namespace Gloobster.DomainObjects
{
	public class FacebookUserExistsDO
	{
		public PortalUserDO PortalUser { get; set; }
		public bool UserExists { get; set; }
	}
}