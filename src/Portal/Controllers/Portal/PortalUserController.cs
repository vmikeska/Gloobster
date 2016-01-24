using System.IO;
using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;

namespace Gloobster.Portal.Controllers.Portal
{
	public class PortalUserController : PortalBaseController
	{
		public IFilesDomain FileDomain { get; set; }

		public PortalUserController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{
			FileDomain = filesDomain;
		}
		
		public IActionResult Detail(string id)
		{
            var viewModel = CreateViewModelInstance<UserDetailViewModel>();
            viewModel.AvatarLink = "/PortalUser/ProfilePicture/" + id;
            viewModel.DisplayName = PortalUser.DisplayName;
            viewModel.Gender = GetGenderStr(PortalUser.Gender);
            viewModel.CurrentLocation = FormatCityStr(PortalUser.CurrentLocation);
            viewModel.HomeLocation = FormatCityStr(PortalUser.HomeLocation);

            return View(viewModel);
		}

		public IActionResult Settings()
		{
			var viewModel = CreateViewModelInstance<SettingsViewModel>();
			viewModel.AvatarLink = "/PortalUser/ProfilePicture";
			viewModel.DisplayName = PortalUser.DisplayName;
			viewModel.Gender = GetGenderStr(PortalUser.Gender);
			viewModel.CurrentLocation = FormatCityStr(PortalUser.CurrentLocation);
			viewModel.HomeLocation = FormatCityStr(PortalUser.HomeLocation);

			return View(viewModel);
		}

		public IActionResult ProfilePicture(string id = null)
		{
            var fileLocation = "avatars";

            PortalUserEntity portalUser;
		    if (!string.IsNullOrEmpty(id))
		    {
		        portalUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == new ObjectId(id));
		        if (portalUser == null)
		        {
                    return new ObjectResult("");
                }
		    }
		    else
		    {
		        portalUser = PortalUser;
		    }
            
			if (portalUser.ProfileImage == null)
			{
				return new ObjectResult("");
			}

			var filePath = FileDomain.Storage.Combine(fileLocation, portalUser.ProfileImage);
			bool exists = FileDomain.Storage.FileExists(filePath);
			if (exists)
			{
				var fileStream = FileDomain.GetFile(fileLocation, portalUser.ProfileImage);				
				return new FileStreamResult(fileStream, "image/jpeg");
			}

			return new ObjectResult("");
		}
	

		public IActionResult Notifications()
		{
			var notifs = DB.C<NotificationsEntity>().First(p => p.PortalUser_id == DBUserId);
			
			var viewModel = CreateViewModelInstance<NotificationsViewModel>();
			viewModel.Notifications = notifs;
			
			return View(viewModel);
		}




		private string FormatCityStr(CityLocationSE city)
		{
			if (city == null)
			{
				return "";
			}

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
