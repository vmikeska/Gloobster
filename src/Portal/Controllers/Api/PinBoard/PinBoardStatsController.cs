using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{
    [Route("api/[controller]")]
	public class PinBoardStatsController : BaseApiController
	{
        public IPinBoardStatRequestCreator RequestCreator { get; set; }

        public PinBoardStatsController(IPinBoardStatRequestCreator requestCreator, ILogger log, IDbOperations db) : base(log, db)
        {
            RequestCreator = requestCreator;
        }

        //public PinBoardStatsController(IVisitedStatesDomain visitedStates, IVisitedPlacesDomain visitedPlaces, IVisitedCitiesDomain visitedCities, 
        //	IVisitedCountriesDomain visitedCountries, ICountryService countryService, ILogger log, IDbOperations db) : base(log, db)
        //{
        //	VisitedPlaces = visitedPlaces;
        //	VisitedCities = visitedCities;
        //	VisitedCountries = visitedCountries;
        //	CountryService = countryService;
        //    VisitedStates = visitedStates;
        //}


        [HttpGet]
		[Authorize(true)]
		public IActionResult Get(PinBoardStatRequest request)
		{
		    PinBoardStatResponse result;
		    if (IsUserLogged)
		    {
		        result = RequestCreator.DataForLoggedInUser(request, UserId);
		    }
		    else
		    {
                //user will always receive "only" all checkins data
                result = RequestCreator.DataForNotLoggedInUser(request.displayEntity, request.dataType);
            }

		    return new ObjectResult(result);
		}

	    
    }
}