
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class UserLoggedResultDO
	{
		public UserLogged Status { get; set; }		
		public string EncodedToken { get; set; }		

		public string UserId { get; set; }
	}
}