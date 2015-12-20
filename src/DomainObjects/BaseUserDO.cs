using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class BaseUserDO
	{
		public string Mail { get; set; }
		public string Password { get; set; }
		public UserActionType Action { get; set; }
	}

	
}