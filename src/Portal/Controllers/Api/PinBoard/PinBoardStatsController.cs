using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.PinBoard;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{	
	[Route("api/[controller]")]
	public class PinBoardStatsController : BaseApiController
	{
		public IVisitedPlacesDomain VisitedPlaces { get; set; }
		public IVisitedCitiesDomain VisitedCities { get; set; }
		public IVisitedCountriesDomain VisitedCountries { get; set; }
        public IVisitedStatesDomain VisitedStates { get; set; }

		public ICountryService CountryService { get; set; }

		public PinBoardStatsController(IVisitedStatesDomain visitedStates, IVisitedPlacesDomain visitedPlaces, IVisitedCitiesDomain visitedCities, 
			IVisitedCountriesDomain visitedCountries, ICountryService countryService, ILogger log, IDbOperations db) : base(log, db)
		{
			VisitedPlaces = visitedPlaces;
			VisitedCities = visitedCities;
			VisitedCountries = visitedCountries;
			CountryService = countryService;
		    VisitedStates = visitedStates;
		}


		[HttpGet]
		[Authorize]
		public IActionResult Get(PinBoardStatRequest request)
		{
			var result = new PinBoardStatResponse();
		    string[] singleFriends = string.IsNullOrEmpty(request.singleFriends) ? new string[0] : request.singleFriends.Split(',');

            var ids = GetPeopleIds(request.me, request.friends, singleFriends);

            if (request.dataType == DataType.Visited)
		    {
		        if (request.displayEntity == DisplayEntity.Pin)
		        {
		            if (request.everybody)
		            {
                        var visitedCities = VisitedCities.GetCitiesOverall();
                        result.visitedCities = visitedCities.Select(c => c.ToResponse()).ToArray();
                    }
		            else
		            {		                
                        var visitedCities = VisitedCities.GetCitiesByUsers(ids, UserId);
                        result.visitedCities = visitedCities.Select(c => c.ToResponse()).ToArray();
                    }
                }

                if (request.displayEntity == DisplayEntity.Countries)
                {
                    if (request.everybody)
                    {
                        var visitedCountries = VisitedCountries.GetCountriesOverall();
                        result.visitedCountries = visitedCountries.Select(c => c.ToResponse()).ToArray();

                        var visitedStates = VisitedStates.GetStatesOverall();
                        result.visitedStates = visitedStates.Select(s => s.ToResponse()).ToArray();
                    }
                    else
                    {                        
                        var visitedCountries = VisitedCountries.GetCountriesByUsers(ids, UserId);
                        result.visitedCountries = visitedCountries.Select(c => c.ToResponse()).ToArray();

                        var visitedStates = VisitedStates.GetStatesByUsers(ids, UserId);
                        result.visitedStates = visitedStates.Select(s => s.ToResponse()).ToArray();
                    }
                }

                if (request.displayEntity == DisplayEntity.Heat)
                {
                    if (request.everybody)
                    {
                        var visitedPlaces = VisitedPlaces.GetPlacesOverall();
                        result.visitedPlaces = visitedPlaces.Select(c => c.ToResponse()).ToArray();
                    }
                    else
                    {
                        var visitedPlaces = VisitedPlaces.GetPlacesByUsers(ids, UserId);
                        result.visitedPlaces = visitedPlaces.Select(c => c.ToResponse()).ToArray();
                    }
                }
            }

            //todo: implement
            if (request.dataType == DataType.Interested)
            {

            }

            return new ObjectResult(result);
		}

        private List<string> GetPeopleIds(bool me, bool friends, string[] ids)
        {
            var outIds = new List<string>();

            if (me)
            {
                outIds.Add(UserId);
            }

            var friendsEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == UserIdObj);

            if (friends)
            {
                outIds.AddRange(friendsEntity.Friends.Select(f => f.ToString()));
            }
            else
            {
                //todo: check if they are really friends
                outIds.AddRange(ids);
            }
            return outIds;
        }        
    }
}