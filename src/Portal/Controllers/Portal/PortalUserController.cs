using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Wiki;
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

        public PortalUserController(INotificationsDomain notifs, IFilesDomain filesDomain, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
			FileDomain = filesDomain;
            Log = log;
            NotificationsDomain = notifs;
		}
		
		public IActionResult Detail(string id)
		{
            var viewModel = CreateViewModelInstance<UserDetailViewModel>();
            viewModel.AvatarLink = "/PortalUser/ProfilePicture/" + id;
            viewModel.DisplayName = User.DisplayName;
            viewModel.Gender = GetGenderStr(User.Gender);
            viewModel.CurrentLocation = FormatCityStr(User.CurrentLocation);
            viewModel.HomeLocation = FormatCityStr(User.HomeLocation);

            return View(viewModel);
		}

        [AuthorizeWeb]
		public IActionResult Settings()
		{
			var viewModel = CreateViewModelInstance<SettingsViewModel>();
			viewModel.AvatarLink = "/PortalUser/ProfilePicture";
			viewModel.DisplayName = User.DisplayName;
			viewModel.Gender = GetGenderStr(User.Gender);
			viewModel.CurrentLocation = FormatCityStr(User.CurrentLocation);
			viewModel.HomeLocation = FormatCityStr(User.HomeLocation);

			return View(viewModel);
		}

	    private FileStreamResult GetProfilePicture(string id, string fileName)
	    {
            UserEntity user;
            if (!string.IsNullOrEmpty(id))
            {
                user = DB.FOD<UserEntity>(u => u.User_id == new ObjectId(id));
                if (user == null)
                {
                    return null;
                }
            }
            else
            {
                user = User;
            }
            
            if (!user.HasProfileImage)
            {
                return null;
            }

            var fileLocation = FileDomain.Storage.Combine(AvatarFilesConsts.Location, user.User_id.ToString());

            var filePath = FileDomain.Storage.Combine(fileLocation, fileName);
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(fileLocation, fileName);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return null;
        }
        
        public IActionResult ProfilePicture(string id = null)
		{
		    var pic = GetProfilePicture(id, "profile.jpg");
			return pic;
		}

        public IActionResult ProfilePicture_s(string id = null)
        {
            var pic = GetProfilePicture(id, "profile_s.jpg");
            return pic;
        }

        public IActionResult ProfilePicture_xs(string id = null)
        {
            var pic = GetProfilePicture(id, "profile_xs.jpg");
            return pic;
        }
        
        public async Task<IActionResult> Notifications()
		{
            await NotificationsDomain.SetAllNotificationsToSeen(UserId);

            var notifs = DB.C<NotificationsEntity>().First(p => p.User_id == UserIdObj);
			
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
