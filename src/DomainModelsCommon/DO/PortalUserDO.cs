namespace Gloobster.DomainModelsCommon.DO
{
	public class PortalUserDO
	{
		public string DbUserId { get; set; }
		public string DisplayName { get; set; }
		public string Password { get; set; }
		public string Mail { get; set; }
		public FacebookGroupDO Facebook { get; set; }
		public TwitterGroupDO Twitter { get; set; }
	}
}