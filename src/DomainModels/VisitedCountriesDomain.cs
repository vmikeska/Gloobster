using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	public class VisitedCountriesDomain: IVisitedCountriesDomain
	{
		public IDbOperations DB { get; set; }
		
		public async Task<List<VisitedCountryDO>> AddNewCountriesAsync(List<VisitedCountryDO> inputCountries, string userId)
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
						PortalUser_id = new ObjectId(country.PortalUserId),
						Dates = country.Dates
	                }; 
					newCountries.Add(newCountry);
				}
			}
			await DB.SaveManyAsync(newCountries);

			var newCountriesResult = newCountries.Select(c => c.ToDO()).ToList();
			return newCountriesResult;
		}

		public async Task<List<VisitedCountryDO>> GetVisitedCountriesByUserIdAsync(string userId)
		{
			var query = $@"{{""PortalUser_id"": ObjectId(""{userId}"")}}";
			var visitedCountriesEntity = await DB.FindAsync<VisitedCountryEntity>(query);

			var visitedCountriesDO = visitedCountriesEntity.Select(c => c.ToDO()).ToList();
			return visitedCountriesDO;
		}

		public List<VisitedCountryDO> GetCountriesOfMyFriendsByUserId(string userId)
		{
			var userIdObj = new ObjectId(userId);
			var friends = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);

			var friendsId = new List<ObjectId> { userIdObj };
			friendsId.AddRange(friends.Friends);

			var visitedCountries = DB.C<VisitedCountryEntity>().Where(p => friendsId.Contains(p.PortalUser_id)).ToList();
			
			var vcGrouped = visitedCountries.GroupBy(g => g.CountryCode2).ToList();
			var vcList = vcGrouped.Select(g =>
			{
				var outCountry = g.First().ToDO();
				outCountry.PortalUserId = null;
				outCountry.Dates = g.Where(d => d.Dates != null).SelectMany(d => d.Dates).ToList();
				return outCountry;
			});

			return vcList.ToList();
		}
	}
}
