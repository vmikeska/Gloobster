using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelBase
	{
        public bool IsUserLogged => PortalUser != null;
		public PortalUserEntity PortalUser { get; set; }
		public IDbOperations DB { get; set; }
		public string SocialNetwork { get; set; }
		public int NotificationCount { get; set; }
	}
}