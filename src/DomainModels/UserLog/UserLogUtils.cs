using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.DomainModels.UserLog
{
    public static class UserLogUtils
    {
        public static async Task<bool> DeleteLog(IDbOperations db, ObjectId uid, ObjectId lid)
        {
            var f = db.F<UserLogEntity>().Eq(p => p.User_id, uid);
            var u = db.PF<UserLogEntity, UserLogSE>(t => t.Logs, c => c.id == lid);
            var result = await db.UpdateAsync(f, u);

            return result.ModifiedCount > 0;
        }

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