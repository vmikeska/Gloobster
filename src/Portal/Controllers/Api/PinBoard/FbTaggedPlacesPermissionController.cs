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

namespace Gloobster.Portal.Controllers.Api.PinBoard
{	
	[Route("api/[controller]")]
	public class FbTaggedPlacesPermissionController : BaseApiController
	{
        public IPlacesExtractor PlacesExtractor { get; set; }
        public IComponentContext ComponentContext { get; set; }

        public FbTaggedPlacesPermissionController(IComponentContext componentContext, IPlacesExtractor placesExtractor, IDbOperations db) : base(db)
        {
            PlacesExtractor = placesExtractor;
            ComponentContext = componentContext;
        }
		
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post()
		{
            PlacesExtractor.Driver = ComponentContext.ResolveKeyed<IPlacesExtractorDriver>("Facebook");

		    var portalUserDO = PortalUser.ToDO();
            var fbAcccount = portalUserDO.GetAccount(SocialNetworkType.Facebook);

            await PlacesExtractor.ExtractNewAsync(portalUserDO.UserId, fbAcccount.Authentication);
            await PlacesExtractor.SaveAsync();

            return new ObjectResult(null);
		}
		
	}	
}