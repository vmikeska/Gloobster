using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.ReqRes.PinBoard;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.PinBoard
{
    public interface IPinBoardStatRequestCreator
    {        
        PinBoardStatResponse DataForLoggedInUser(PinBoardStatRequest request, string userId);
    }

    public class PinBoardStatRequestCreator: IPinBoardStatRequestCreator
    {
        public IVisitedPlacesDomain VisitedPlaces { get; set; }
        public IVisitedCitiesDomain VisitedCities { get; set; }
        public IVisitedCountriesDomain VisitedCountries { get; set; }
        public IVisitedStatesDomain VisitedStates { get; set; }
        public IEntitiesDemandor Demandor { get; set; }

        public IDbOperations DB { get; set; }

        public PinBoardStatResponse DataForLoggedInUser(PinBoardStatRequest request, string userId)
        {
            var result = new PinBoardStatResponse();
            string[] singleFriends = string.IsNullOrEmpty(request.singleFriends)
                ? new string[0]
                : request.singleFriends.Split(',');

            var ids = GetPeopleIds(request.me, request.friends, singleFriends, userId);


            if (request.dataType == DataType.Cities)
            {
                if (request.everybody)
                {
                    result.visitedCities = GetVisitedCitiesOverall();
                }
                else
                {
                    var visitedCities = VisitedCities.GetCitiesByUsers(ids, userId);
                    result.visitedCities = visitedCities.Select(c => VisitedCityMappers.ToResponse(c)).ToArray();
                }
            }

            if (request.dataType == DataType.Countries)
            {
                if (request.everybody)
                {
                    result.visitedCountries = GetVisitedCountriesOverall();
                    result.visitedStates = GetVisitedStatesOverall();
                }
                else
                {
                    var visitedCountries = VisitedCountries.GetCountriesByUsers(ids, userId);
                    result.visitedCountries = visitedCountries.Select(c => c.ToResponse()).ToArray();

                    var visitedStates = VisitedStates.GetStatesByUsers(ids, userId);
                    result.visitedStates = visitedStates.Select(s => s.ToResponse()).ToArray();
                }
            }

            if (request.dataType == DataType.Places)
            {
                if (request.everybody)
                {
                    result.visitedPlaces = GetVisitedPlacesOverall();
                }
                else
                {
                    var visitedPlaces = VisitedPlaces.GetPlacesByUsers(ids, userId);
                    result.visitedPlaces = visitedPlaces.Select(c => c.ToResponse()).ToArray();
                }
            }


            return result;
        }

        private VisitedCityItemResponse[] GetVisitedCitiesOverall()
        {
            var visitedCities = VisitedCities.GetCitiesOverall();
            var visitedCitiesRes = visitedCities.Select(c => c.ToResponse()).ToArray();
            return visitedCitiesRes;
        }

        private VisitedPlaceItemResponse[] GetVisitedPlacesOverall()
        {
            var visitedPlaces = VisitedPlaces.GetPlacesOverall();
            var visitedPlacesRes = visitedPlaces.Select(c => c.ToResponse()).ToArray();
            return visitedPlacesRes;
        }

        private VisitedCountryItemResponse[] GetVisitedCountriesOverall()
        {
            var visitedCountries = VisitedCountries.GetCountriesOverall();
            var visitedCountriesRes = visitedCountries.Select(c => c.ToResponse()).ToArray();
            return visitedCountriesRes;
        }

        private VisitedStateItemResponse[] GetVisitedStatesOverall()
        {
            var visitedStates = VisitedStates.GetStatesOverall();
            var visitedStatesRes = visitedStates.Select(s => s.ToResponse()).ToArray();
            return visitedStatesRes;
        }
        
        private List<string> GetPeopleIds(bool me, bool friendsChecked, string[] ids, string userId)
        {
            var outIds = new List<string>();
            var userIdObj = new ObjectId(userId);

            if (me)
            {
                outIds.Add(userId);
            }

            var friendsEntity = DB.FOD<FriendsEntity>(f => f.User_id == userIdObj);
            if (friendsEntity != null)
            {
                var friendsIds = friendsEntity.Friends.Select(f => f.ToString()).ToList();

                if (friendsChecked)
                {
                    if (ids.Any())
                    {
                        outIds.AddRange(ids);
                    }
                    else
                    {
                        outIds.AddRange(friendsIds);
                    }                    
                }
                else
                {
                    var securedFriends = ids.Where(f => friendsIds.Contains(f)).ToList();
                    outIds.AddRange(securedFriends);
                }
            }

            return outIds;
        }
    }
}