using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Planning;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{
	
	public class PlanningDomain: IPlanningDomain
	{
		public IDbOperations DB { get; set; }

		public async Task<bool> ChangeCountrySelection(CountrySelectionDO selection)
		{
			if (selection.PlanningType == PlanningType.Anytime)
			{
				bool changed = await ChangeCountrySelectionAnytime(selection);
				return changed;
			}

			if (selection.PlanningType == PlanningType.Weekend)
			{
				bool changed = await ChangeCountrySelectionWeekend(selection);
				return changed;
			}

			if (selection.PlanningType == PlanningType.Custom)
			{

			}

			return false;
		}

		private async Task<bool> ChangeCountrySelectionAnytime(CountrySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCountry = anytime.CountryCodes.Contains(selection.CountryCode);

			if (selection.Selected && !hasCountry)
			{
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Push(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCountry)
			{
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Pull(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		private async Task<bool> ChangeCountrySelectionWeekend(CountrySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var weekend = DB.C<PlanningWeekendEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCountry = weekend.CountryCodes.Contains(selection.CountryCode);

			if (selection.Selected && !hasCountry)
			{
				var filter = DB.F<PlanningWeekendEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningWeekendEntity>().Push(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCountry)
			{
				var filter = DB.F<PlanningWeekendEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningWeekendEntity>().Pull(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}
		
		public async Task<bool> ChangeCitySelection(CitySelectionDO selection)
		{
			if (selection.PlanningType == PlanningType.Anytime)
			{
				var changed = await ChangeCitySelectionAnytime(selection);
				return changed;
			}

			if (selection.PlanningType == PlanningType.Weekend)
			{
				var changed = await ChangeCitySelectionWeekend(selection);
				return changed;
			}

			if (selection.PlanningType == PlanningType.Custom)
			{

			}

			return false;
		}

		private async Task<bool> ChangeCitySelectionAnytime(CitySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCity = anytime.Cites.Contains(selection.GID);

			if (selection.Selected && !hasCity)
			{
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Push(p => p.Cites, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCity)
			{
				var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningAnytimeEntity>().Pull(p => p.Cites, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		private async Task<bool> ChangeCitySelectionWeekend(CitySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.C<PlanningWeekendEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCity = anytime.Cites.Contains(selection.GID);

			if (selection.Selected && !hasCity)
			{
				var filter = DB.F<PlanningWeekendEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningWeekendEntity>().Push(p => p.Cites, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCity)
			{
				var filter = DB.F<PlanningWeekendEntity>().Eq(p => p.PortalUser_id, userIdObj);
				var update = DB.U<PlanningWeekendEntity>().Pull(p => p.Cites, selection.GID);
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
					CountryCodes = new List<string>(),
					Cites = new List<int>()
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
