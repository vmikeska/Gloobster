using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Planning;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
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
				bool changed = await ChangeCountrySelectionCustom(selection);
				return changed;
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
				bool changed = await ChangeCitySelectionCustom(selection);
				return changed;
			}

			return false;
		}


		private async Task<bool> ChangeCountrySelectionAnytime(CountrySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCountry = anytime.CountryCodes.Contains(selection.CountryCode);

			var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);

			if (selection.Selected && !hasCountry)
			{				
				var update = DB.U<PlanningAnytimeEntity>().Push(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCountry)
			{				
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

			var filter = DB.F<PlanningWeekendEntity>().Eq(p => p.PortalUser_id, userIdObj);

			if (selection.Selected && !hasCountry)
			{				
				var update = DB.U<PlanningWeekendEntity>().Push(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCountry)
			{			
				var update = DB.U<PlanningWeekendEntity>().Pull(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}
		
		
		private async Task<bool> ChangeCountrySelectionCustom(CountrySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var customIdObj = new ObjectId(selection.CustomId);
			var custom = DB.C<PlanningCustomEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);
			var customSearch = custom.Searches.FirstOrDefault(s => s.id == customIdObj);

			if (customSearch == null)
			{
				//throw
			}

			bool hasCountry = customSearch.CountryCodes.Contains(selection.CountryCode);

			var filter = DB.F<PlanningCustomEntity>().Eq(p => p.PortalUser_id, userIdObj)
				& DB.F<PlanningCustomEntity>().Eq("Searches._id", customIdObj);

			if (selection.Selected && !hasCountry)
			{
				var update = DB.U<PlanningCustomEntity>().Push("Searches.$.CountryCodes", selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCountry)
			{
				var update = DB.U<PlanningCustomEntity>().Pull("Searches.$.CountryCodes", selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		private async Task<bool> ChangeCitySelectionCustom(CitySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var customIdObj = new ObjectId(selection.CustomId);
			var custom = DB.C<PlanningCustomEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);
			
			var customSearch = custom.Searches.FirstOrDefault(s => s.id == customIdObj);

			if (customSearch == null)
			{
				//throw
			}

			bool hasCity = customSearch.Cities.Contains(selection.GID);

			var filter = DB.F<PlanningCustomEntity>().Eq(p => p.PortalUser_id, userIdObj)
					& DB.F<PlanningCustomEntity>().Eq("Searches._id", customIdObj);

			if (selection.Selected && !hasCity)
			{				
				var update = DB.U<PlanningCustomEntity>().Push("Searches.$.Cities", selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCity)
			{				
				var update = DB.U<PlanningCustomEntity>().Pull("Searches.$.Cities", selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		private async Task<bool> ChangeCitySelectionAnytime(CitySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.C<PlanningAnytimeEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCity = anytime.Cities.Contains(selection.GID);

			var filter = DB.F<PlanningAnytimeEntity>().Eq(p => p.PortalUser_id, userIdObj);

			if (selection.Selected && !hasCity)
			{				
				var update = DB.U<PlanningAnytimeEntity>().Push(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCity)
			{			
				var update = DB.U<PlanningAnytimeEntity>().Pull(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		private async Task<bool> ChangeCitySelectionWeekend(CitySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.C<PlanningWeekendEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			bool hasCity = anytime.Cities.Contains(selection.GID);

			var filter = DB.F<PlanningWeekendEntity>().Eq(p => p.PortalUser_id, userIdObj);

			if (selection.Selected && !hasCity)
			{				
				var update = DB.U<PlanningWeekendEntity>().Push(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCity)
			{			
				var update = DB.U<PlanningWeekendEntity>().Pull(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		public async Task<bool> ChangeWeekendExtraDaysLength(string userId, int daysLength)
	    {
			var userIdObj = new ObjectId(userId);
			var filter = DB.F<PlanningWeekendEntity>().Eq(p => p.PortalUser_id, userIdObj);
			var update = DB.U<PlanningWeekendEntity>().Set(p => p.ExtraDaysLength, daysLength);
			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		public async Task<CustomSearchDO> CreateNewEmptySearch(string userId, string name)
		{
			var newSearch = new CustomSearchSE
			{
				id = ObjectId.GenerateNewId(),
				Cities = new List<int>(),
				CountryCodes = new List<string>(),
				Months = new List<int>(),
				SearchName = name,
				FromAirports = new List<FlightSE>(),
				Years = new List<int>(),
				RoughlyDays = 0
			};

			var userIdObj = new ObjectId(userId);			
			var filter = DB.F<PlanningCustomEntity>().Eq(p => p.PortalUser_id, userIdObj);				
			var update = DB.U<PlanningCustomEntity>().Push(p => p.Searches, newSearch);
			var res = await DB.UpdateAsync(filter, update);

			CustomSearchDO nsDO = newSearch.ToDO();
            return nsDO;
		}

		public async Task<bool> PushCustomProperty(string userId, string searchId, string propName, object value)
		{
			var userIdObj = new ObjectId(userId);
			var searchIdObj = new ObjectId(searchId);
			var filter = DB.F<PlanningCustomEntity>().Eq(p => p.PortalUser_id, userIdObj)
				& DB.F<PlanningCustomEntity>().Eq("Searches._id", searchIdObj);
			var update = DB.U<PlanningCustomEntity>().Push("Searches.$." + propName, value);
			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		public async Task<bool> UpdateCustomProperty(string userId, string searchId, string propName, object value)
		{
			var userIdObj = new ObjectId(userId);
			var searchIdObj = new ObjectId(searchId);
			var filter = DB.F<PlanningCustomEntity>().Eq(p => p.PortalUser_id, userIdObj) 
				& DB.F<PlanningCustomEntity>().Eq("Searches._id", searchIdObj);
			var update = DB.U<PlanningCustomEntity>().Set("Searches.$." + propName, value);
			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
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
					ExtraDaysLength = 0,
					CountryCodes = new List<string>(),
					Cities = new List<int>()
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
					Cities = new List<int>()
				};
				await DB.SaveAsync(anytime);
			}

			var custom = DB.C<PlanningCustomEntity>().FirstOrDefault(e => e.PortalUser_id == userIdObj);
			if (custom == null)
			{
				var search1 = new CustomSearchSE
				{
					id = ObjectId.GenerateNewId(),
					SearchName = "My summer holiday search",					
					RoughlyDays = 7,
					Months = new List<int> {3, 4},
					Years = new List<int> {2016, 2017},
					CountryCodes = new List<string> {"CZ", "DE"},
					Cities = new List<int> {2950159, 2911298, 3067696},
					FromAirports = new List<FlightSE>(),
				};

				custom = new PlanningCustomEntity
				{
					id = ObjectId.GenerateNewId(),
					PortalUser_id = userIdObj,
					Searches = new List<CustomSearchSE> {search1}
				};
				await DB.SaveAsync(custom);
			}
		}
		

	}

	

	


}
