﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;
using System.Linq;
using Gloobster.Entities.SearchEngine;

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
			var anytime = DB.FOD<DealsAnytimeEntity>(u => u.User_id == userIdObj);

			bool hasCountry = anytime.CountryCodes.Contains(selection.CountryCode);

			var filter = DB.F<DealsAnytimeEntity>().Eq(p => p.User_id, userIdObj);

			if (selection.Selected && !hasCountry)
			{				
				var update = DB.U<DealsAnytimeEntity>().Push(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCountry)
			{				
				var update = DB.U<DealsAnytimeEntity>().Pull(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		private async Task<bool> ChangeCountrySelectionWeekend(CountrySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var weekend = DB.FOD<DealsWeekendEntity>(u => u.User_id == userIdObj);

			bool hasCountry = weekend.CountryCodes.Contains(selection.CountryCode);

			var filter = DB.F<DealsWeekendEntity>().Eq(p => p.User_id, userIdObj);

			if (selection.Selected && !hasCountry)
			{				
				var update = DB.U<DealsWeekendEntity>().Push(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCountry)
			{			
				var update = DB.U<DealsWeekendEntity>().Pull(p => p.CountryCodes, selection.CountryCode);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}


        private async Task<bool> ChangeCitySelectionCustom(CitySelectionDO selection)
        {
            var userIdObj = new ObjectId(selection.UserId);
            var customIdObj = new ObjectId(selection.CustomId);
            var custom = DB.FOD<DealsCustomEntity>(u => u.User_id == userIdObj);

            var customSearch = custom.Searches.FirstOrDefault(s => s.id == customIdObj);

            if (customSearch == null)
            {
                //throw
            }

            bool hasCity = customSearch.GIDs.Contains(selection.GID);

            var filter = DB.F<DealsCustomEntity>().Eq(p => p.User_id, userIdObj)
                         & DB.F<DealsCustomEntity>().Eq("Searches._id", customIdObj);

            if (selection.Selected && !hasCity)
            {
                var update = DB.U<DealsCustomEntity>().Push("Searches.$.GIDs", selection.GID);
                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }

            if (!selection.Selected && hasCity)
            {
                var update = DB.U<DealsCustomEntity>().Pull("Searches.$.GIDs", selection.GID);
                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }

            return false;
        }

        private async Task<bool> ChangeCountrySelectionCustom(CountrySelectionDO selection)
        {
            var uid = new ObjectId(selection.UserId);
            var cid = new ObjectId(selection.CustomId);
            var custom = DB.FOD<DealsCustomEntity>(u => u.User_id == uid);
            var customSearch = custom.Searches.FirstOrDefault(s => s.id == cid);

            if (customSearch == null)
            {
                //throw
            }

            bool hasCountry = customSearch.CCs.Contains(selection.CountryCode);

            var filter = DB.F<DealsCustomEntity>().Eq(p => p.User_id, uid)
                         & DB.F<DealsCustomEntity>().Eq("Searches._id", cid);

            if (selection.Selected && !hasCountry)
            {
                var update = DB.U<DealsCustomEntity>().Push("Searches.$.CCs", selection.CountryCode);
                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }

            if (!selection.Selected && hasCountry)
            {
                var update = DB.U<DealsCustomEntity>().Pull("Searches.$.CCs", selection.CountryCode);
                var res = await DB.UpdateAsync(filter, update);
                return res.ModifiedCount == 1;
            }

            return false;
        }



        private async Task<bool> ChangeCitySelectionAnytime(CitySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.FOD<DealsAnytimeEntity>(u => u.User_id == userIdObj);

			bool hasCity = anytime.Cities.Contains(selection.GID);

			var filter = DB.F<DealsAnytimeEntity>().Eq(p => p.User_id, userIdObj);

			if (selection.Selected && !hasCity)
			{				
				var update = DB.U<DealsAnytimeEntity>().Push(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCity)
			{			
				var update = DB.U<DealsAnytimeEntity>().Pull(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		private async Task<bool> ChangeCitySelectionWeekend(CitySelectionDO selection)
		{
			var userIdObj = new ObjectId(selection.UserId);
			var anytime = DB.FOD<DealsWeekendEntity>(u => u.User_id == userIdObj);

			bool hasCity = anytime.Cities.Contains(selection.GID);

			var filter = DB.F<DealsWeekendEntity>().Eq(p => p.User_id, userIdObj);

			if (selection.Selected && !hasCity)
			{				
				var update = DB.U<DealsWeekendEntity>().Push(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			if (!selection.Selected && hasCity)
			{			
				var update = DB.U<DealsWeekendEntity>().Pull(p => p.Cities, selection.GID);
				var res = await DB.UpdateAsync(filter, update);
				return res.ModifiedCount == 1;
			}

			return false;
		}

		public async Task<bool> ChangeWeekendExtraDaysLength(string userId, int daysLength)
	    {
			var userIdObj = new ObjectId(userId);
			var filter = DB.F<DealsWeekendEntity>().Eq(p => p.User_id, userIdObj);
			var update = DB.U<DealsWeekendEntity>().Set(p => p.ExtraDaysLength, daysLength);
			var res = await DB.UpdateAsync(filter, update);
			return res.ModifiedCount == 1;
		}

		

		
		
		public async void CreateDBStructure(string userId)
	    {
			var userIdObj = new ObjectId(userId);
			var user = DB.FOD<UserEntity>(e => e.User_id == userIdObj);

			var weekend = DB.FOD<DealsWeekendEntity>(e => e.User_id == userIdObj);
		    if (weekend == null)
		    {
			    weekend = new DealsWeekendEntity
			    {
				    id = ObjectId.GenerateNewId(),
				    User_id = userIdObj,
					ExtraDaysLength = 0,
					CountryCodes = new List<string>(),
					Cities = new List<int>()
			    };
			    await DB.SaveAsync(weekend);
		    }

			var anytime = DB.FOD<DealsAnytimeEntity>(e => e.User_id == userIdObj);
			if (anytime == null)
			{
				anytime = new DealsAnytimeEntity
				{
					id = ObjectId.GenerateNewId(),
					User_id = userIdObj,
					CountryCodes = new List<string>(),
					Cities = new List<int>()
				};
				await DB.SaveAsync(anytime);
			}            
		}
		

	}

	

	


}
