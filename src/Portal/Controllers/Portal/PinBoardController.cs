using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class PinBoardController : PortalBaseController
    {
		public ISharedMapImageDomain SharedImgDomain { get; set; }
        public IFacebookService FBService { get; set; }
        public IComponentContext ComponentContext { get; set; }
        public IPlacesExtractor PlacesExtractor { get; set; }
        
        public PinBoardController(IPlacesExtractor placesExtractor, IComponentContext componentContext, IFacebookService fbService, 
            ISharedMapImageDomain sharedImgDomain,ILogger log,  IDbOperations db) : base(log, db)
		{
            SharedImgDomain = sharedImgDomain;
            FBService = fbService;
            PlacesExtractor = placesExtractor;
            ComponentContext = componentContext;
            Log = log;
        }
    
	    public async Task<IActionResult> Pins()
	    {
	        PinBoardViewModel vm = CreateViewModelInstance<PinBoardViewModel>();
            if (IsUserLogged)
	        {
                vm.InitializeLogged(UserId);
                await ImportNewFbPins();
            }
	        else
	        {
	            vm.InitializeNotLogged();                
            }
            
            return View(vm);
		}
        
        //todo: move somewhere
        private async Task<bool> ImportNewFbPins()
        {
            try
            {
                var user = PortalUser.ToDO();
                var facebook = user.GetAccount(SocialNetworkType.Facebook);

                bool isFbUser = (facebook != null);
                if (isFbUser)
                {
                    FBService.SetAccessToken(facebook.Authentication.AccessToken);
                    bool hasPermissions = FBService.HasPermissions("user_tagged_places");
                    if (hasPermissions)
                    {
                        PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Facebook");

                        await PlacesExtractor.ExtractNewAsync(user.UserId, facebook.Authentication);
                        await PlacesExtractor.SaveAsync();
                    }
                }

                return true;
            }
            catch (Exception exc)
            {
                Log.Error("ImportNewFbPins: " + exc.Message);
                return false;
            }
        }

        public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetPinBoardMap(id);				
			return new FileStreamResult(mapStream, "image/png");
		}


	}
}
