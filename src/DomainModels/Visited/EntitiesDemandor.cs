using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels
{  
    public interface IVisitedEntityRequestor
    {
        Task<VisitedEntity> GetOrCreate(string userId);
    }

    
    public class VisitedEntityRequestor: IVisitedEntityRequestor
    {
        public IDbOperations DB { get; set; }

        public async Task<VisitedEntity> GetOrCreate(string userId)
        {
            var userIdObj = new ObjectId(userId);
            var e = DB.FOD<VisitedEntity>(v => v.User_id == userIdObj);
            if (e != null)
            {
                return e;
            }
            
            e = new VisitedEntity
            {
                id = ObjectId.GenerateNewId(),
                User_id = userIdObj,
                Places = new List<VisitedPlaceSE>(),
                Cities = new List<VisitedCitySE>(),
                Countries = new List<VisitedCountrySE>(),
                States = new List<VisitedStateSE>()
            };
            await DB.SaveAsync(e);
            return e;
        }

        public VisitedEntity Get(string userId)
        {                            
            var userIdObj = new ObjectId(userId);
            var e = DB.FOD<VisitedEntity>(v => v.User_id == userIdObj);
            if (e != null)
            {
                return e;
            }

            throw new Exception($"VisitedEntity with userId {userId} should exists, but it doesnt");
        }
    }
    
}