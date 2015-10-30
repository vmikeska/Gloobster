using Gloobster.Common;
using Gloobster.Common.DbEntity.PortalUser;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelBase
	{
		public PortalUserEntity PortalUser { get; set; }
		public IDbOperations DB { get; set; }
		public string SocialNetwork { get; set; }
	}
}