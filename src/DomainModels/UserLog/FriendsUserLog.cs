using System;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces.UserLogs;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.DomainModels.UserLog
{
    public class FriendsUserLog: IFriendsUserLog
    {
        public IDbOperations DB { get; set; }

        public async Task Change(string userId, string friendId)
        {
            var uid = new ObjectId(userId);
            var fid = new ObjectId(friendId);

            var userLogEntity = UserLogUtils.GetOrCreate(DB, uid);

            var friend = DB.FOD<UserEntity>(e => e.User_id == fid);
            if (friend == null)
            {
                return;
            }

            var log = new UserLogSE
            {
                id = ObjectId.GenerateNewId(),
                Major_id = fid,
                Param1 = friend.DisplayName, 
                Created = DateTime.UtcNow,
                Type = LogType.Friend
            };

            var f = DB.F<UserLogEntity>().Eq(p => p.User_id, uid);
            var u = DB.U<UserLogEntity>().Push(p => p.Logs, log);
            var result = await DB.UpdateAsync(f, u);
        }
    }
}