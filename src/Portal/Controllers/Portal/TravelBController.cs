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
            vm.Languages = User.Languages;
            vm.EmptyProps = GetEmptyProps(UserId);

            return View(vm);
        }

        private List<string> GetEmptyProps(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

            var props = new List<string>();

            if (string.IsNullOrEmpty(user.FirstName))
            {
                props.Add("FirstName");
            }

            if (string.IsNullOrEmpty(user.LastName))
            {
                props.Add("LastName");
            }

            if (!user.HasProfileImage)
            {
                props.Add("HasProfileImage");
            }

            if (user.HomeLocation == null)
            {
                props.Add("HomeLocation");
            }
            
            if (user.Languages == null || user.Languages.Count == 0)
            {
                props.Add("Languages");
            }

            if (user.Interests == null || user.Interests.Count == 0)
            {
                props.Add("Interests");
            }

            if (user.Gender == Gender.N)
            {
                props.Add("Gender");
            }

            if (!user.BirthYear.HasValue)
            {
                props.Add("BirthYear");
            }

            if (!user.BirthYear.HasValue)
            {
                props.Add("BirthYear");
            }

            if (user.FamilyStatus == FamilyStatus.NA)
            {
                props.Add("FamilyStatus");
            }

            return props;
        }

        public IActionResult Message(string id)
        {
            var userIdObj = new ObjectId(id);

            var user = DB.FOD<UserEntity>(u => u.User_id == userIdObj);

            var vm = CreateViewModelInstance<MessageViewModel>();
            vm.OtherUserId = id;
            vm.OtherUserDisplayName = user.DisplayName;
            vm.OtherUserFirstName = user.FirstName;
            vm.OtherUserLastName = user.LastName;

            return View(vm);            
        }

        
        public IActionResult Management()
        {
            var vm = CreateViewModelInstance<TravelBManagementViewModel>();
            return View(vm);
        }
        
    }


    

    
}
