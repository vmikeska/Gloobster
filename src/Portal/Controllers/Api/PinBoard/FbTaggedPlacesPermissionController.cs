using System.Collections.Generic;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{	
	[Route("api/[controller]")]
	public class FbTaggedPlacesPermissionController : BaseApiController
	{
        public IPlacesExtractor PlacesExtractor { get; set; }
        public IComponentContext ComponentContext { get; set; }
        public IAccountDomain AccountDomain { get; set; }

        public FbTaggedPlacesPermissionController(IAccountDomain accountDomain, IComponentContext componentContext, IPlacesExtractor placesExtractor, ILogger log, IDbOperations db) : base(log, db)
        {
            PlacesExtractor = placesExtractor;
            ComponentContext = componentContext;
            AccountDomain = accountDomain;
        }
		
		[HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post()
		{
            PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Facebook");

		    var portalUserDO = PortalUser.ToDO();
            var fbAcccount = AccountDomain.GetAuth(SocialNetworkType.Facebook, UserId);

            //todo: fix
            //await PlacesExtractor.ExtractNewAsync(portalUserDO.UserId, fbAcccount.Authentication);
            //await PlacesExtractor.SaveAsync();

            return new ObjectResult(null);
		}
		
	}	
}