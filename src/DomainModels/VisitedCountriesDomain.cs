using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class VisitedCountriesDomain: IVisitedCountriesDomain
	{
		public IDbOperations DB;

		public VisitedCountriesDomain(IDbOperations db)
		{
			DB = db;
		}

		public async Task<List<VisitedCountryDO>> AddNewCountries(List<VisitedCountryDO> inputCountries, string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var savedCountries = await DB.FindAsync<VisitedCountryEntity>(query);
			var savedCountriesCodes = savedCountries.Select(c => c.CountryCode2).ToList();

			var newCountries = new List<VisitedCountryEntity>();
            foreach (var country in inputCountries)
			{
				bool alreadySaved = savedCountriesCodes.Contains(country.CountryCode2);
                if (!alreadySaved)
                {
	                var newCountry = new VisitedCountryEntity
	                {
						id = ObjectId.GenerateNewId(),
						CountryCode2 = country.CountryCode2,
						PortalUser_id = new ObjectId(userId)
	                }; 
					newCountries.Add(newCountry);
				}
			}
			await DB.SaveManyAsync(newCountries);

			var newCountriesResult = newCountries.Select(c => c.ToDO()).ToList();
			return newCountriesResult;
		}

		public async Task<List<VisitedCountryDO>> GetVisitedCountriesByUserId(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var visitedCountriesEntity = await DB.FindAsync<VisitedCountryEntity>(query);

			var visitedCountriesDO = visitedCountriesEntity.Select(c => c.ToDO()).ToList();
			return visitedCountriesDO;
		}
	}
}
