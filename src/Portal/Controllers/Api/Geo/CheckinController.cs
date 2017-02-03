using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.MoveOut;
using Gloobster.ReqRes.PinBoard;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Geo
{
    
	[Route("api/[controller]")]
	public class CheckinController : BaseApiController
	{
		public ICheckinPlaceDomain CheckinDomain { get; set; }
		public ICountryService CountryService { get; set; }
        public IFacebookService FBService { get; set; }
        public IFacebookShare FBShare { get; set; }
        public IAccountDomain AccountDomain { get; set; }
        public IPinBoardStats PinBoardStats { get; set; }

        public CheckinController(IPinBoardStats pinBoardStats, IAccountDomain accountDomain, IFacebookShare fbShare, IFacebookService fbService, ICheckinPlaceDomain checkinDomain, ICountryService countryService, ILogger log, IDbOperations db) : base(log, db)
		{
			CheckinDomain = checkinDomain;
			CountryService = countryService;
		    FBService = fbService;
            FBShare = fbShare;
            AccountDomain = accountDomain;
            PinBoardStats = pinBoardStats;
		}
		
		[HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody]CheckinRequest place)
		{
			var sourceType = (SourceType)place.SourceType;
			
			var checkedDO = await CheckinDomain.CheckinPlace(place.SourceId, sourceType, UserId);
            
		    if (sourceType == SourceType.FB && place.CheckToSoc)
		    {
		        CheckinToFb(place);
		    }

			var response = await CreateResponse(checkedDO);
		    return new ObjectResult(response);
		}

	    private async Task<PinBoardStatResponse> CreateResponse(AddedPlacesResultDO checkedDO)
	    {
	        var responser = new PinsResponser
	        {
	            PinBoardStats = PinBoardStats
	        };
            
	        var response = await responser.Create(UserId);
            
            if (checkedDO.Countries != null)
	        {
	            response.visitedCountries = checkedDO.Countries.Select(c => c.ToResponse()).ToArray();
	        }

	        if (checkedDO.Cities != null)
	        {
	            response.visitedCities = checkedDO.Cities.Select(c => c.ToResponse()).ToArray();
	        }

	        if (checkedDO.Places != null)
	        {
	            response.visitedPlaces = checkedDO.Places.Select(c => c.ToResponse()).ToArray();
	        }

	        if (checkedDO.States != null)
	        {
	            response.visitedStates = checkedDO.States.Select(s => s.ToResponse()).ToArray();
	        }

            return response;
	    }

	    private void CheckinToFb(CheckinRequest place)
	    {
            //https://developers.facebook.com/docs/graph-api/reference/v2.5/user/feed/            
            var fb = AccountDomain.GetAuth(SocialNetworkType.Facebook, UserId);
            if (fb != null)
            {
                var checkin = new FacebookCheckinDO
                {
                    Message = "Pinned by Gloobster.com",
                    Place = place.SourceId
                };
                
                FBShare.Checkin(checkin, fb);
            }
        }

		
	}
}