using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.DomainObjects.TravelB;
using Gloobster.Entities.TravelB;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels.TravelB
{
    public class CheckinCityDomain
    {
        public IDbOperations DB { get; set; }

        public async Task HistorizeCheckins()
        {
            var outdatedCheckins = DB.List<CheckinCityEntity>(c => c.ValidUntil < DateTime.UtcNow);

            if (!outdatedCheckins.Any())
            {
                return;
            }

            var ids = outdatedCheckins.Select(c => c.id).ToList();

            await DB.DeleteAsync<CheckinCityEntity>(d => ids.Contains(d.id));

            var name = typeof(CheckinCityHEntity).Name.Replace("Entity", string.Empty);
            foreach (var c in outdatedCheckins)
            {
                await DB.SaveCustomAsync(c, name);
            }
        }

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
            //todo: date time should work by timezone. Make by country ?
            checkin.ValidUntil = checkin.ToDate.ToDateEnd(DateTimeKind.Utc);

            var entity = checkin.ToEntity();
            entity.id = ObjectId.GenerateNewId();

            await DB.SaveAsync(entity);
        }

        public async Task UpdateCheckin(CheckinCityDO checkin)
        {                     
            var entity = checkin.ToEntity();
            entity.ValidUntil = checkin.ToDate.ToDateEnd(DateTimeKind.Utc);
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
}