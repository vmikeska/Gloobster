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
        //PinBoardStatResponse DataForNotLoggedInUser(DisplayEntity entity, DataType type);
        Task<PinBoardStatResponse> DataForLoggedInUser(PinBoardStatRequest request, string userId);
    }

    public class PinBoardStatRequestCreator: IPinBoardStatRequestCreator
    {
        public IVisitedPlacesDomain VisitedPlaces { get; set; }
        public IVisitedCitiesDomain VisitedCities { get; set; }
        public IVisitedCountriesDomain VisitedCountries { get; set; }
        public IVisitedStatesDomain VisitedStates { get; set; }
        public IEntitiesDemandor Demandor { get; set; }

        public IDbOperations DB { get; set; }

        //public PinBoardStatResponse DataForNotLoggedInUser(DisplayEntity entity, DataType type)
        //{
        //    var result = new PinBoardStatResponse();

        //    if (type == DataType.Visited)
        //    {
        //        if (entity == DisplayEntity.Pin)
        //        {
        //            result.visitedCities = GetVisitedCitiesOverall();
        //        }

        //        if (entity == DisplayEntity.Countries)
        //        {
        //            result.visitedCountries = GetVisitedCountriesOverall();
        //            result.visitedStates = GetVisitedStatesOverall();
        //        }

        //        if (entity == DisplayEntity.Heat)
        //        {
        //            result.visitedPlaces = GetVisitedPlacesOverall();
        //        }
        //    }

        //    //todo: implement
        //    if (type == DataType.Interested)
        //    {

        //    }

        //    return result;
        //}

        public async Task<PinBoardStatResponse> DataForLoggedInUser(PinBoardStatRequest request, string userId)
        {
            var result = new PinBoardStatResponse();
            string[] singleFriends = string.IsNullOrEmpty(request.singleFriends) ? new string[0] : request.singleFriends.Split(',');

            var ids = await GetPeopleIds(request.me, request.friends, singleFriends, userId);

            if (request.dataType == DataType.Visited)
            {
                if (request.displayEntity == DisplayEntity.Pin)
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

                if (request.displayEntity == DisplayEntity.Countries)
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

                if (request.displayEntity == DisplayEntity.Heat)
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
            }

            //todo: implement
            if (request.dataType == DataType.Interested)
            {

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
        
        private async Task<List<string>> GetPeopleIds(bool me, bool friends, string[] ids, string userId)
        {
            var outIds = new List<string>();
            var userIdObj = new ObjectId(userId);

            if (me)
            {
                outIds.Add(userId);
            }

            var friendsEntity = await Demandor.GetFriendsAsync(userIdObj);
            
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