using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.TravelB;
using Gloobster.Entities.TravelB;
using Gloobster.Enums;
using MongoDB.Bson;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.TravelB
{
    public class CheckinNowDomain
    {
        public IDbOperations DB { get; set; }

        public async Task HistorizeCheckins()
        {
            var outdatedCheckins = DB.List<CheckinNowEntity>(c => c.WaitingUntil < DateTime.UtcNow);

            if (!outdatedCheckins.Any())
            {
                return;
            }

            var ids = outdatedCheckins.Select(c => c.id).ToList();

            await DB.DeleteAsync<CheckinNowEntity>(d => ids.Contains(d.id));

            var name = typeof(CheckinNowHEntity).Name.Replace("Entity", string.Empty);
            foreach (var c in outdatedCheckins)
            {
                await DB.SaveCustomAsync(c, name);
            }            
        }

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
            
            //delete old one
            var oldCheckin = DB.FOD<CheckinNowEntity>(e => e.User_id == userIdObj);
            if (oldCheckin != null)
            {
                await DB.DeleteAsync<CheckinNowEntity>(oldCheckin.id);

                var name = typeof(CheckinNowHEntity).Name.Replace("Entity", string.Empty);                                
                await DB.SaveCustomAsync(oldCheckin, name);
            }

            //create new
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
