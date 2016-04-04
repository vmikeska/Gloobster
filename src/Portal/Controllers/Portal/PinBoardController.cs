using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
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
        public IEntitiesDemandor Demandor { get; set; }
        public IAccountDomain SocAccount { get; set; }

        public PinBoardController(IEntitiesDemandor demandor, IPlacesExtractor placesExtractor, IComponentContext componentContext, IFacebookService fbService, 
            ISharedMapImageDomain sharedImgDomain,ILogger log,  IDbOperations db) : base(log, db)
		{
            SharedImgDomain = sharedImgDomain;
            FBService = fbService;
            PlacesExtractor = placesExtractor;
            ComponentContext = componentContext;
            Demandor = demandor;
		}

        [CreateAccount]
        public async Task<IActionResult> Pins()
	    {
	        PinBoardViewModel vm = CreateViewModelInstance<PinBoardViewModel>();
            bool visitedExists = false;
            if (UserIdObj.HasValue)
            {
                var visitedRes = Demandor.VisitedExists(UserIdObj.Value);
                if (visitedRes.Exists)
                {
                    vm.InitializeExists(visitedRes.Entity, Demandor);
                    
                    //todo: bring back to life
                    await ImportNewFbPins();
                }
                else
                {
                    vm.InitializeNotExists();
                }
            }
            
            return View(vm);
		}
        
        //todo: move somewhere
        private async Task<bool> ImportNewFbPins()
        {            
            try
            {

                SocAuthDO facebook = SocAccount.GetAuth(SocialNetworkType.Facebook, UserId);

                bool isFbUser = (facebook != null);
                if (isFbUser)
                {
                    FBService.SetAccessToken(facebook.AccessToken);
                    bool hasPermissions = FBService.HasPermissions("user_tagged_places");
                    if (hasPermissions)
                    {
                        PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Facebook");

                        await PlacesExtractor.ExtractNewAsync(UserId, facebook);
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

            return false;
        }

        public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetPinBoardMap(id);				
			return new FileStreamResult(mapStream, "image/png");
		}


	}
}
