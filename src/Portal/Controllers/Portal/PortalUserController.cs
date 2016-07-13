using System.Collections.Generic;
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
            var user = DB.FOD<UserEntity>(f => f.User_id == new ObjectId(id));


            var vm = CreateViewModelInstance<UserDetailViewModel>();
            vm.DefaultLangModuleName = "pageUserSettings";
            vm.LoadClientTexts();
            vm.AvatarLink = "/PortalUser/ProfilePicture/" + id;

            if (user != null)
            {
                vm.DisplayName = user.DisplayName;
                vm.Gender = GetGenderStr(user.Gender, vm);
                vm.CurrentLocation = FormatCityStr(user.CurrentLocation);
                vm.HomeLocation = FormatCityStr(user.HomeLocation);
            }

            return View(vm);
        }

        [AuthorizeWeb]
		public IActionResult Settings()
		{
			var vm = CreateViewModelInstance<SettingsViewModel>();
            vm.DefaultLangModuleName = "pageUserSettings";
            vm.LoadClientTexts();
            vm.AvatarLink = "/PortalUser/ProfilePicture";

            vm.DisplayName = User.DisplayName;
            vm.FirstName = User.FirstName;
            vm.LastName = User.LastName;

            vm.BirthYear = User.BirthYear;

			vm.Gender = GetGenderStr(User.Gender, vm);
            vm.FamilyStatus = GetStatusStr(User.FamilyStatus, vm);

            vm.CurrentLocation = FormatCityStr(User.CurrentLocation);
			vm.HomeLocation = FormatCityStr(User.HomeLocation);

            vm.Languages = User.Languages;
            vm.Interests = User.Interests;

            vm.ShortDescription = User.ShortDescription;
            
            return View(vm);
		}

        [AuthorizeWeb]
        public async Task<IActionResult> Notifications()
        {
            await NotificationsDomain.SetAllNotificationsToSeen(UserId);

            var notifs = DB.FOD<NotificationsEntity>(p => p.User_id == UserIdObj);

            var vm = CreateViewModelInstance<NotificationsViewModel>();
            vm.LoadClientTexts();
            vm.DefaultLangModuleName = "pageNotifications";
            vm.Notifications = notifs;

            return View(vm);
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
            if (pic == null)
            {
                return Redirect("/images/Anonymous.jpg");
            }
			return pic;
		}

        public IActionResult ProfilePicture_s(string id = null)
        {
            var pic = GetProfilePicture(id, "profile_s.jpg");
            if (pic == null)
            {
                return Redirect("/images/Anonymous.jpg");
            }
            return pic;
        }

        public IActionResult ProfilePicture_xs(string id = null)
        {
            var pic = GetProfilePicture(id, "profile_xs.jpg");
            if (pic == null)
            {
                return Redirect("/images/Anonymous.jpg");
            }
            return pic;
        }
        
        
        
		private string FormatCityStr(CityLocationSE city)
		{
			if (city == null)
			{
				return "";
			}

			return $"{city.City}, {city.CountryCode}";
		}
		
		private string GetGenderStr(Gender gender, ViewModelBase vm)
		{
			if (gender == Gender.M)
			{
				return  vm.W("Male", "layout");
			}

			if (gender == Gender.F)
			{
				return vm.W("Female", "layout");
			}

			return "N/A";
		}

        private string GetStatusStr(FamilyStatus? status, ViewModelBase vm)
        {
            if (!status.HasValue)
            {
                return string.Empty;
            }

            if (status == FamilyStatus.Single)
            {
                return "Single";
            }

            if (status == FamilyStatus.InRelationship)
            {
                return "InRelationship";
            }
            
            return "N/A";
        }

    }
}
