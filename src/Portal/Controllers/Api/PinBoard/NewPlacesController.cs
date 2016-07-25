using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Places;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{	
	[Route("api/[controller]")]
	public class NewPlacesController : BaseApiController
	{
        public IFacebookService FBService { get; set; }
        public IPinboardImportDomain PinboardImport { get; set; }
        public IComponentContext ComponentContext { get; set; }
        public IPlacesExtractor PlacesExtractor { get; set; }

        public NewPlacesController(IPlacesExtractor placesExtractor, IComponentContext componentContext, IPinboardImportDomain pinboardImport, 
            IFacebookService fbService, ILogger log, IDbOperations db) : base(log, db)
		{
            FBService = fbService;
            PinboardImport = pinboardImport;
            ComponentContext = componentContext;
            PlacesExtractor = placesExtractor;
        }


		[HttpGet]
		[AuthorizeApi]
		public async Task<IActionResult> Get()
		{
		    bool any = await ExtractPlaces();
            return new ObjectResult(any);
        }

        private async Task<bool> ExtractPlaces()
        {
            bool anyFb = false;
            bool anyTw = false;

            if (HasSocNet(SocialNetworkType.Facebook))
            {
                var fb = GetSocNet(SocialNetworkType.Facebook);
                FBService.SetAccessToken(fb.AccessToken);
                bool hasPermissions = FBService.HasPermissions("user_tagged_places");
                if (hasPermissions)
                {
                    anyFb = await PinboardImport.ImportFb(UserId);                    
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
                anyTw = await PlacesExtractor.SaveAsync();
            }

            bool any = anyFb || anyTw;
            return any;
        }

    }
}