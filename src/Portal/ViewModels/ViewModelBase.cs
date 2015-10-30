using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelBase
	{
		public PortalUserEntity PortalUser { get; set; }
		public IDbOperations DB { get; set; }
		public string SocialNetwork { get; set; }
	}
}