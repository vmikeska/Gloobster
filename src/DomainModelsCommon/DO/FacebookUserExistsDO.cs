namespace Gloobster.DomainModelsCommon.DO
{
	public class FacebookUserExistsDO
	{
		public PortalUserDO PortalUser { get; set; }
		public bool UserExists { get; set; }
	}
}