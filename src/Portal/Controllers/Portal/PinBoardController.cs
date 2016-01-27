using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Places;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Http;
using MongoDB.Driver;
using System.Linq;
using Serilog;

namespace Gloobster.Portal.Controllers.Portal
{
    public class PinBoardController : PortalBaseController
    {
		public ISharedMapImageDomain SharedImgDomain { get; set; }
        public IFacebookService FBService { get; set; }
        public IComponentContext ComponentContext { get; set; }
        public IPlacesExtractor PlacesExtractor { get; set; }

        public ILogger Log { get; set; }

        public PinBoardController(ILogger log, IPlacesExtractor placesExtractor, IComponentContext componentContext, IFacebookService fbService, 
            ISharedMapImageDomain sharedImgDomain, IDbOperations db) : base(db)
		{
            SharedImgDomain = sharedImgDomain;
            FBService = fbService;
            PlacesExtractor = placesExtractor;
            ComponentContext = componentContext;
            Log = log;
        }
    
	    public async Task<IActionResult> Pins()
	    {
	        await ImportNewFbPins();
            
            var pinBoardViewModel = CreateViewModelInstance<PinBoardViewModel>();			           
			pinBoardViewModel.Initialize(UserId);

	        var friendsEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == DBUserId);
	        var friends = DB.C<PortalUserEntity>().Where(f => friendsEntity.Friends.Contains(f.id)).ToList();
	        pinBoardViewModel.Friends = friends.Select(f => new Friend
	        {
	            DisplayName = f.DisplayName,
                Id = f.id.ToString()
	        }).ToList();
            
            return View(pinBoardViewModel);
		}

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
