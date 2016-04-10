using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Places;
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
using MongoDB.Bson;
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
            
		    if (sourceType == SourceType.FB)
		    {
		        CheckinToFb(place);
		    }

			var response = await CreateResponse(checkedDO);
		    return new ObjectResult(response);
		}

	    private async Task<PinBoardStatResponse> CreateResponse(AddedPlacesResultDO checkedDO)
	    {
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

	        if (checkedDO.States != null)
	        {
	            response.visitedStates = checkedDO.States.Select(s => s.ToResponse()).ToArray();
	        }

	        var stats = await PinBoardStats.GetStatsAsync(UserId);

	        response.citiesCount = stats.CitiesCount;
	        response.countriesCount = stats.CountriesCount;
	        response.worldTraveledPercent = stats.WorldTraveledPercent;
	        response.statesCount = stats.StatesCount;

	        response.africaCities = stats.AfricaCities;
	        response.asiaCities = stats.AsiaCities;
	        response.northAmericaCities = stats.NorthAmericaCities;
	        response.southAmericaCities = stats.SouthAmericaCities;
	        response.europeCities = stats.EuropeCities;

            response.topCities = new List<int>();
            response.topCities.AddRange(stats.AfricaCities);
            response.topCities.AddRange(stats.AsiaCities);
            response.topCities.AddRange(stats.EuropeCities);
            response.topCities.AddRange(stats.NorthAmericaCities);
            response.topCities.AddRange(stats.SouthAmericaCities);
            response.topCities.AddRange(stats.AustraliaCities);

            response.stateCodes = stats.StateCodes;
            response.countryCodes = stats.CountryCodes;

            return response;
	    }

	    private void CheckinToFb(CheckinRequest place)
	    {
            //https://developers.facebook.com/docs/graph-api/reference/v2.5/user/feed/

            var usrDO = PortalUser.ToDO();
            var fb = AccountDomain.GetAuth(SocialNetworkType.Facebook, UserId);
            if (fb != null)
            {
                var checkin = new FacebookCheckinDO
                {
                    Message = "Pinned by Gloobster.com",
                    Place = place.SourceId
                };

                //todo: fix
                //FBShare.Checkin(checkin, fb.Authentication);
            }
        }

		
	}
}