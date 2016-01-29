﻿using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
	public class PortalUserController : PortalBaseController
	{
		public IFilesDomain FileDomain { get; set; }
        public INotificationsDomain NotificationsDomain { get; set; }

        public PortalUserController(INotificationsDomain notifs, IFilesDomain filesDomain,ILogger log,  IDbOperations db) : base(log, db)
		{
			FileDomain = filesDomain;
            Log = log;
            NotificationsDomain = notifs;
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

        [Authorize]
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
	
		public async Task<IActionResult> Notifications()
		{
            await NotificationsDomain.SetAllNotificationsToSeen(UserId);

            var notifs = DB.C<NotificationsEntity>().First(p => p.PortalUser_id == UserIdObj);
			
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
