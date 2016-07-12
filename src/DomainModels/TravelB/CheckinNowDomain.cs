using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.TravelB;
using Gloobster.Entities.TravelB;
using MongoDB.Bson;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.TravelB
{

    public class CheckinCityDomain
    {
        public IDbOperations DB { get; set; }

        public List<CheckinCityDO> GetCheckinsInRect(RectDO rect)
        {
            var checkins = DB.List<CheckinCityEntity>();

            var outCheckins = new List<CheckinCityDO>();
            foreach (var checkin in checkins)
            {
                bool withinRect = CheckinUtils.WithinRectangle(rect, checkin.WaitingCoord);
                if (withinRect)
                {
                    var checkinDo = checkin.ToDO();
                    outCheckins.Add(checkinDo);
                }
            }

            return outCheckins;
        }

        public async Task CreateCheckin(CheckinCityDO checkin)
        {
            var entity = checkin.ToEntity();
            entity.id = ObjectId.GenerateNewId();

            await DB.SaveAsync(entity);
        }

        public async Task UpdateCheckin(CheckinCityDO checkin)
        {                     
            var entity = checkin.ToEntity();            
            await DB.ReplaceOneAsync(entity);
        }

        public async Task<bool> DeleteCheckin(string id, string userId)
        {
            var userIdObj = new ObjectId(userId);

            var idObj = new ObjectId(id);
            bool deleted = await DB.DeleteAsync<CheckinCityEntity>(c => c.id == idObj && c.User_id == userIdObj);
            return deleted;
        }
    }

    public class CheckinNowDomain
    {
        public IDbOperations DB { get; set; }
        
        public List<CheckinNowDO> GetCheckinsInRect(RectDO rect)
        {
            var checkins = DB.List<CheckinNowEntity>();

            var outCheckins = new List<CheckinNowDO>();
            foreach (var checkin in checkins)
            {
                bool withinRect = CheckinUtils.WithinRectangle(rect, checkin.WaitingCoord);
                if (withinRect)
                {
                    var checkinDo = checkin.ToDO();
                    outCheckins.Add(checkinDo);
                }
            }

            return outCheckins;
        }
        
        public async Task CreateCheckin(CheckinNowDO checkin)
        {
            var userIdObj = new ObjectId(checkin.UserId);
            await DB.DeleteAsync<CheckinNowEntity>(a => a.User_id == userIdObj);

            var entity = checkin.ToEntity();
            entity.id = ObjectId.GenerateNewId();

            await DB.SaveAsync(entity);
        }
        
    }

    public class CheckinUtils
    {
        public static bool WithinRectangle(RectDO rectDO, LatLng coord)
        {
            if (coord == null)
            {
                return false;
            }

            if (coord.Lat > rectDO.LatNorth)
                return false;
            if (coord.Lat < rectDO.LatSouth)
                return false;

            if (rectDO.LngEast >= rectDO.LngWest)
                return ((coord.Lng >= rectDO.LngWest) && (coord.Lng <= rectDO.LngEast));
            else
                return (coord.Lng >= rectDO.LngWest);

            return false;
        }
    }
}
