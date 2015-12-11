using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
			var userIdObj = new ObjectId(userId);
			var visited = DB.C<VisitedEntity>().FirstOrDefault(v => v.PortalUser_id == userIdObj);

			var savedCountries = visited.Countries;
			var savedCountriesCodes = savedCountries.Select(c => c.CountryCode2).ToList();

			var newCountries = new List<VisitedCountrySE>();
            foreach (var country in inputCountries)
			{
				bool alreadySaved = savedCountriesCodes.Contains(country.CountryCode2);
                if (!alreadySaved)
                {
	                var newCountry = new VisitedCountrySE
	                {
						id = ObjectId.GenerateNewId(),
						CountryCode2 = country.CountryCode2,						
						Dates = country.Dates
	                }; 
					newCountries.Add(newCountry);
				}
			}
			await PushCountries(userIdObj, newCountries);
			
			var newCountriesResult = newCountries.Select(c => c.ToDO()).ToList();
			return newCountriesResult;
		}

		private async Task<bool> PushCountries(ObjectId userIdObj, List<VisitedCountrySE> value)
		{
			var filter = DB.F<VisitedEntity>().Eq(v => v.PortalUser_id, userIdObj) ;
			var update = DB.U<VisitedEntity>().PushEach(v => v.Countries, value);

			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		public List<VisitedCountryDO> GetVisitedCountriesByUserId(string userId)
		{
			var visited = DB.C<VisitedEntity>().FirstOrDefault(v => v.PortalUser_id == new ObjectId(userId));

			var visitedCountriesDO = visited.Countries.Select(c => c.ToDO()).ToList();
			return visitedCountriesDO;
		}

		public List<VisitedCountryDO> GetCountriesOfMyFriendsByUserId(string userId)
		{
			var userIdObj = new ObjectId(userId);
			var friends = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);

			var friendsId = new List<ObjectId> { userIdObj };
			friendsId.AddRange(friends.Friends);

			var visitedFriends = DB.C<VisitedEntity>().Where(p => friendsId.Contains(p.PortalUser_id)).ToList();

			var visitedCountries = visitedFriends.SelectMany(v => v.Countries);

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
