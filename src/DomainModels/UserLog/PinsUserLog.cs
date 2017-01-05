using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces.UserLogs;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.DomainModels.UserLog
{
    public class PinsUserLog: IPinsUserLog
    {
        private const int GroupingPeriodHours = 24;

        public IDbOperations DB { get; set; }

        public async Task Change(string userId, List<string> displayPlaces, int totalCount)
        {
            var uid = new ObjectId(userId);

            var userLogEntity = UserLogUtils.GetOrCreate(DB, uid);

            var logs = userLogEntity.Logs.Where(l => l.Type == LogType.Pins).ToList();

            var lastLog = logs.OrderByDescending(l => l.Created).FirstOrDefault();

            var shouldUpdate = lastLog != null && (DateTime.UtcNow - lastLog.Created).TotalHours < GroupingPeriodHours;

            if (shouldUpdate)
            {
                var lastTotalCount = int.Parse(lastLog.Param2);
                var newTotalCount = lastTotalCount + totalCount;

                var newLog = new UserLogSE
                {
                    id = lastLog.id,
                    Created = lastLog.Created,
                    Type = LogType.Pins,
                    Major_id = ObjectId.Empty,
                    Param1 = JoinPlaces(displayPlaces),
                    Param2 = newTotalCount.ToString()                    
                };

                await UserLogUtils.DeleteLog(DB, uid, lastLog.id);
                
                var f = DB.F<UserLogEntity>().Eq(p => p.User_id, uid);
                var u = DB.U<UserLogEntity>().Push(p => p.Logs, newLog);
                var result = await DB.UpdateAsync(f, u);
            }
            else
            {
                await CreateLog(uid, displayPlaces, totalCount);
            }
        }

        private string JoinPlaces(List<string> places)
        {
            return string.Join("|", places);
        }

        private async Task CreateLog(ObjectId uid, List<string> places, int totalCount)
        {
            var log = new UserLogSE
            {
                id = ObjectId.GenerateNewId(),
                Major_id = ObjectId.Empty,
                Param1 = JoinPlaces(places),
                Param2 = totalCount.ToString(),
                Created = DateTime.UtcNow,
                Type = LogType.Pins
            };

            var f = DB.F<UserLogEntity>().Eq(p => p.User_id, uid);
            var u = DB.U<UserLogEntity>().Push(p => p.Logs, log);
            var result = await DB.UpdateAsync(f, u);
        }
    }
}