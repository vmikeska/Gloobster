using Gloobster.Common;
using Gloobster.Common.DbEntity.PortalUser;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.Portal.Controllers.Portal
{
	public class PortalUserController : PortalBaseController
	{
		
		public PortalUserController(IDbOperations db) : base(db)
		{
		
		}
		
		public IActionResult Detail()
		{
			return View();
		}

		public IActionResult Settings()
		{
			
			var portalUser = DB.C<PortalUserEntity>().First(p => p.id == DBUserId);

			var avatarsDir = "~/FileRepository/Avatars/";

			var viewModel = new SettingsViewModel
			{
				AvatarLink = avatarsDir + portalUser.ProfileImage
			};

			return View(viewModel);
		}
	
	}

	public class SettingsViewModel
	{
		public string AvatarLink { get; set; }
	}
		 
	
}
