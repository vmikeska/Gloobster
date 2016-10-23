using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.ViewModels;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.Entities;
using Gloobster.Entities.TravelB;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Portal
{
    public class TravelBController : PortalBaseController
    {		
        public TravelBController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            
		}
        
        [CreateAccount]
        public IActionResult Home()
        {
            var vm = CreateViewModelInstance<TravelBViewModel>();

            vm.DefaultLangModuleName = "pageTravelB";
            vm.LoadClientTexts(new[] { "jsTravelB" });

            vm.GenderStr = GetGenderStr(User.Gender, vm);
            vm.EmptyProps = GetEmptyProps(UserId);

            return View(vm);
        }

        private string GetGenderStr(Gender gender, ViewModelBase vm)
        {
            if (gender == Gender.M)
            {
                return vm.W("Male", "layout");
            }

            if (gender == Gender.F)
            {
                return vm.W("Female", "layout");
            }

            return "N/A";
        }

        private List<string> GetEmptyProps(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

            var props = new List<string>();

            if (!user.HasProfileImage)
            {
                props.Add("HasProfileImage");
            }

            if (string.IsNullOrEmpty(user.FirstName))
            {
                props.Add("FirstName");
            }

            if (string.IsNullOrEmpty(user.LastName))
            {
                props.Add("LastName");
            }
            
            if (user.HomeLocation == null)
            {
                props.Add("HomeLocation");
            }
            
            if (user.Languages == null || user.Languages.Count == 0)
            {
                props.Add("Languages");
            }
            
            if (user.Gender == Gender.N)
            {
                props.Add("Gender");
            }

            if (!user.BirthYear.HasValue)
            {
                props.Add("BirthYear");
            }
            
            return props;
        }

        
        public IActionResult Management()
        {
            var vm = CreateViewModelInstance<TravelBManagementViewModel>();
            return View(vm);
        }
        
    }
}
