using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Planning;
using Gloobster.Entities.Trip;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	
	public class PlanningDomain: IPlanningDomain
	{
		public IDbOperations DB { get; set; }
		
	    public async Task<bool> ChangeCountrySelection(string userId, string countryCode, bool selected)
	    {
			var userIdObj = new ObjectId(userId);
		    var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);				

		    bool hasCountry = anytime.CountryCodes.Contains(countryCode);

			if (selected && !hasCountry)
		    {
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Push(p => p.CountryCodes, countryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

		    if (!selected && hasCountry)
		    {
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Pull(p => p.CountryCodes, countryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

		    return false;
	    }

		public async Task<bool> ChangeCitySelection(string userId, int gid, bool selected)
		{
			var userIdObj = new ObjectId(userId);
			var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCity = anytime.Cites.Contains(gid);

			if (selected && !hasCity)
			{
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Push(p => p.Cites, gid);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selected && hasCity)
			{
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Pull(p => p.Cites, gid);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		public void ChangeWeekendDuration()
	    {
		    
	    }
		
		public async void CreateDBStructure(string userId)
	    {
			var userIdObj = new ObjectId(userId);

		    var weekend = DB.C<PlanningWeekendEntity>().FirstOrDefault(e => e.PortalUser_id == userIdObj);
		    if (weekend == null)
		    {
			    weekend = new PlanningWeekendEntity
			    {
				    id = ObjectId.GenerateNewId(),
				    PortalUser_id = userIdObj,
					LongWeekend = 0,
					CountryCodes = new List<string>()
			    };
			    await DB.SaveAsync(weekend);
		    }

			var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(e => e.PortalUser_id == userIdObj);
			if (anytime == null)
			{
				anytime = new PlanningAnytimeEntity
				{
					id = ObjectId.GenerateNewId(),
					PortalUser_id = userIdObj,
					CountryCodes = new List<string>(),
					Cites = new List<int>()
				};
				await DB.SaveAsync(anytime);
			}
		}
		

	}

	

	


}
