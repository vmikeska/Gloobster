using System.Threading.Tasks;
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
        
        public IPlacesExtractor PlacesExtractor { get; set; }        
        public IAccountDomain SocAccount { get; set; }
        public IPinboardImportDomain PinboardImport { get; set; }
        public IPinBoardStats Stats { get; set; }

        public PinBoardController(IPinBoardStats stats, IPinboardImportDomain pinboardImport, IAccountDomain socAccount, IFacebookService fbService, 
            ISharedMapImageDomain sharedImgDomain, ILogger log,  IDbOperations db) : base(log, db)
		{
            SharedImgDomain = sharedImgDomain;
            FBService = fbService;                        
            SocAccount = socAccount;
            PinboardImport = pinboardImport;
            Stats = stats;
		}

        [CreateAccount]
        public async Task<IActionResult> Pins()
	    {
	        var vm = CreateViewModelInstance<PinBoardViewModel>();            
            if (UserIdObj.HasValue)
            {
                bool showFbDialog = false;
                var facebook = SocAccount.GetAuth(SocialNetworkType.Facebook, UserId);
                bool isFbUser = (facebook != null);
                if (isFbUser)
                {
                    FBService.SetAccessToken(facebook.AccessToken);
                    bool hasPermissions = FBService.HasPermissions("user_tagged_places");
                    if (hasPermissions)
                    {
                        await PinboardImport.ImportFb(UserId);
                    }
                    else
                    {
                        showFbDialog = true;
                    }
                }
                
                await vm.InitializeExists(UserId, showFbDialog, Stats);                
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
