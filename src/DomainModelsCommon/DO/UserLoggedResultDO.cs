using Gloobster.Common.CommonEnums;

namespace Gloobster.DomainModelsCommon.DO
{
	public class UserLoggedResultDO
	{
		public UserLogged Status { get; set; }		
		public string EncodedToken { get; set; }		

		public string UserId { get; set; }
	}
}