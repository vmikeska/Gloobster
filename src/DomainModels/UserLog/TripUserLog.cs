using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainInterfaces.UserLogs;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using MongoDB.Bson;

namespace Gloobster.DomainModels.UserLog
{
    public class TripUserLog: ITripUserLog
    {        
        public IDbOperations DB { get; set; }
        
        public async Task Change(string userId, string entityId)
        {
            var tid = new ObjectId(entityId);
            var uid = new ObjectId(userId);

            var userLogEntity = UserLogUtils.GetOrCreate(DB, uid);

            var log = userLogEntity.Logs.FirstOrDefault(l => l.Major_id == tid);

            var trip = DB.FOD<TripEntity>(t => t.id == tid);

            bool logExists = log != null;
            if (logExists)
            {
                await DeleteLog(uid, log.id);                
            }

            bool tripExists = (trip != null);
            bool createNew = tripExists && (trip.AllowToRequestJoin || trip.FriendsPublic);

            if (createNew)
            {
                await CreateLog(uid, trip);
            }


        }

        private async Task CreateLog(ObjectId uid, TripEntity trip)
        {
            var log = new UserLogSE
            {
                id = ObjectId.GenerateNewId(),
                Major_id = trip.id,
                Param1 = trip.Name,
                Created = trip.CreatedDate,                
                Type = LogType.Trip
            };

            var f = DB.F<UserLogEntity>().Eq(p => p.User_id, uid);
            var u = DB.U<UserLogEntity>().Push(p => p.Logs, log);
            var result = await DB.UpdateAsync(f, u);
        }


        private async Task<bool> DeleteLog(ObjectId uid, ObjectId lid)
        {
            var f = DB.F<UserLogEntity>().Eq(p => p.User_id, uid);
            var u = DB.PF<UserLogEntity, UserLogSE>(t => t.Logs, c => c.id == lid);
            var result = await DB.UpdateAsync(f, u);

            return result.ModifiedCount > 0;
        }

        

    }

    public static class UserLogUtils
    {
        public static UserLogEntity GetOrCreate(IDbOperations db, ObjectId uid)
        {
            var userLogEntity = db.FOD<UserLogEntity>(u => u.User_id == uid);
            if (userLogEntity == null)
            {
                userLogEntity = new UserLogEntity
                {
                    id = ObjectId.GenerateNewId(),
                    User_id = uid,
                    Logs = new List<UserLogSE>()
                };

                db.SaveAsync(userLogEntity);
            }

            return userLogEntity;
        }
    }
    
}
