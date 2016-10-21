using System.Collections.Generic;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Serilog;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Portal
{    
    public class PinBoardController : PortalBaseController
    {
		public ISharedMapImageDomain SharedImgDomain { get; set; }
        public IFacebookService FBService { get; set; }
        
              
        public IAccountDomain SocAccount { get; set; }
        
        public IPinBoardStats Stats { get; set; }
        
        public PinBoardController(IPinBoardStats stats, IAccountDomain socAccount, IFacebookService fbService, 
            ISharedMapImageDomain sharedImgDomain, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            SharedImgDomain = sharedImgDomain;
            FBService = fbService;                        
            SocAccount = socAccount;            
            Stats = stats;            
            
		}
 
        [CreateAccount]
        public async Task<IActionResult> Pins()
        {
            var vm = CreateViewModelInstance<PinBoardViewModel>();
            vm.DefaultLangModuleName = "pagePins";
            vm.LoadClientTexts(new[] { "jsPins" });
            if (UserIdObj.HasValue)
            {
                //await ExtractPlaces();                
                await vm.Initialize(UserId, Stats);
            }

            return View(vm);
        }

        public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetPinBoardMap(id);				
			return new FileStreamResult(mapStream, "image/png");
		}


	}
}
