namespace Gloobster.DomainModelsCommon.DO
{
	public class CreateFacebookUserResultDO
	{
		public UserCreated Status { get; set; }
		public PortalUserDO CreatedUser { get; set; }
	}
}