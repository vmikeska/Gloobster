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
        
        public IPlacesExtractor PlacesExtractor { get; set; }        
        public IAccountDomain SocAccount { get; set; }
        public IPinboardImportDomain PinboardImport { get; set; }
        public IPinBoardStats Stats { get; set; }

        public IComponentContext ComponentContext { get; set; }


        private bool _showFbDialog = true;

        public PinBoardController(IPlacesExtractor placesExtractor, IComponentContext componentContext, IPinBoardStats stats, IPinboardImportDomain pinboardImport, IAccountDomain socAccount, IFacebookService fbService, 
            ISharedMapImageDomain sharedImgDomain, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            SharedImgDomain = sharedImgDomain;
            FBService = fbService;                        
            SocAccount = socAccount;
            PinboardImport = pinboardImport;
            Stats = stats;
            ComponentContext = componentContext;
            PlacesExtractor = placesExtractor;

		}

        [CreateAccount]
        public async Task<IActionResult> Pins()
	    {
	        var vm = CreateViewModelInstance<PinBoardViewModel>();
            vm.DefaultLangModuleName = "pagePins";
            vm.LoadClientTexts(new []{"jsPins"});
            if (UserIdObj.HasValue)
            {
                await ExtractPlaces();                
                await vm.Initialize(UserId, _showFbDialog, Stats);                
            }
            
            return View(vm);
		}
        
        private async Task ExtractPlaces()
        {            
            if (HasSocNet(SocialNetworkType.Facebook))
            {
                var fb = GetSocNet(SocialNetworkType.Facebook);
                FBService.SetAccessToken(fb.AccessToken);
                bool hasPermissions = FBService.HasPermissions("user_tagged_places");
                if (hasPermissions)
                {
                    await PinboardImport.ImportFb(UserId);
                    _showFbDialog = false;
                }
            }
            
            if (HasSocNet(SocialNetworkType.Twitter))
            {
                PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Twitter");

                var tw = GetSocNet(SocialNetworkType.Twitter);
                var auth = new SocAuthDO
                {
                    AccessToken = tw.AccessToken,
                    TokenSecret = tw.TokenSecret,
                    SocUserId = tw.UserId,
                    UserId = tw.User_id.ToString()
                };
                await PlacesExtractor.ExtractNewAsync(UserId, auth);
                await PlacesExtractor.SaveAsync();
            }
        }
        
        public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetPinBoardMap(id);				
			return new FileStreamResult(mapStream, "image/png");
		}


	}
}
