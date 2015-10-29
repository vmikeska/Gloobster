using Gloobster.Common;
using Gloobster.Common.DbEntity.PortalUser;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
using Gloobster.Common.CommonEnums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;

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

			var viewModel = CreateViewModelInstance<SettingsViewModel>();			
			viewModel.AvatarLink = avatarsDir + portalUser.ProfileImage;
			viewModel.DisplayName = portalUser.DisplayName;
			viewModel.Gender = GetGenderStr(portalUser.Gender);
			viewModel.CurrentLocation = FormatCityStr(portalUser.CurrentLocation);
			viewModel.HomeLocation = FormatCityStr(portalUser.HomeLocation);
			
			return View(viewModel);
		}

		private string FormatCityStr(CityLocationSE city)
		{
			return $"{city.City}, {city.CountryCode}";
		}

		private string GetGenderStr(Gender gender)
		{
			if (gender == Gender.M)
			{
				return "Male";
			}

			if (gender == Gender.F)
			{
				return "Female";
			}

			return "N/A";
		}
	
	}
}
