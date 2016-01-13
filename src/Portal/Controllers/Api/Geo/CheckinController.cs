using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Gloobster.ReqRes.MoveOut;
using Gloobster.ReqRes.PinBoard;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.Geo
{
	[Route("api/[controller]")]
	public class CheckinController : BaseApiController
	{
		public ICheckinPlaceDomain CheckinDomain { get; set; }
		public ICountryService CountryService { get; set; }
        public IFacebookService FBService { get; set; }
        public IFacebookShare FBShare { get; set; }
        
        public CheckinController(IFacebookShare fbShare, IFacebookService fbService, ICheckinPlaceDomain checkinDomain, ICountryService countryService, IDbOperations db) : base(db)
		{
			CheckinDomain = checkinDomain;
			CountryService = countryService;
		    FBService = fbService;
            FBShare = fbShare;
		}
		
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post([FromBody]CheckinRequest place)
		{
			var sourceType = (SourceType)place.SourceType;
			
			var checkedDO = await CheckinDomain.CheckinPlace(place.SourceId, sourceType, UserId);

		    if (sourceType == SourceType.FB)
		    {
                //https://developers.facebook.com/docs/graph-api/reference/v2.5/user/feed/
		        
		        var usrDO = PortalUser.ToDO();
		        var fb = usrDO.GetAccount(SocialNetworkType.Facebook);
		        if (fb != null)
		        {
		            var checkin = new FacebookCheckinDO
		            {
		                Message = "Pinned by Gloobster.com",
		                Place = place.SourceId		                
		            };

                    FBShare.Checkin(checkin, fb.Authentication);
                }                
		    }

			var response = new PinBoardStatResponse();

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

			var visited = DB.C<VisitedEntity>().FirstOrDefault(v => v.PortalUser_id == UserIdObj);
			response.citiesCount = visited.Cities.Count;
			response.countriesCount = visited.Countries.Count;
			response.worldTraveledPercent = PinBoardUtils.CalculatePercentOfWorldTraveled(visited.Countries.Count);			

			return new ObjectResult(response);
		}

		
	}
}