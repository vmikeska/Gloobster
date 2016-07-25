using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.DomainInterfaces;
using Gloobster.ReqRes.PinBoard;

namespace Gloobster.Portal.Controllers.Api.Geo
{
    public class PinsResponser
    {
        public IPinBoardStats PinBoardStats { get; set; }

        public async Task<PinBoardStatResponse> Create(string userId)
        {
            var response = new PinBoardStatResponse();

            var stats = await PinBoardStats.GetStatsAsync(userId);

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
    }
}