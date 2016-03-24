using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
    public abstract class BaseAdminTaskExecutor
    {
        public IDbOperations DB;

        public abstract string Caption {get;}

        public List<IExecOperation> Operations;

        public abstract void Initialize(IComponentContext componentContext);

        public IExecOperation GetOperationByName(string name)
        {
            var oper = Operations.FirstOrDefault(o => o.Name == name);
            return oper;
        }

        protected WikiAdminTaskEntity GetNewTask(string articleId, AdminTaskType type)
        {
            var articleIdObj = new ObjectId(articleId);
            var task = new WikiAdminTaskEntity
            {
                id = ObjectId.GenerateNewId(),
                Article_id = articleIdObj,
                State = AdminTaskState.New,
                Type = type
            };

            return task;
        }

        public abstract void AddTask(NewTaskDO taskDO);        
    }
    
    public class OperationUtils
    {
        public IDbOperations DB { get; set; }

        public OperationUtils(IDbOperations db)
        {
            DB = db;
        }

        public WikiAdminTaskEntity GetTaskById(string id)
        {
            var taskIdObj = new ObjectId(id);
            var task = DB.C<WikiAdminTaskEntity>().FirstOrDefault(i => i.id == taskIdObj);
            return task;
        }

        public async Task<bool> SetTaskToStateAsync(string id, AdminTaskState state)
        {
            var taskIdObj = new ObjectId(id);

            var filter = DB.F<WikiAdminTaskEntity>().Eq(e => e.id, taskIdObj);
            var update = DB.U<WikiAdminTaskEntity>().Set(e => e.State, state);
            var res = await DB.UpdateAsync(filter, update);
            
            return res.ModifiedCount == 1;
        }

        public async Task<bool> SetToResolvedAsync(string id, string userId)
        {
            bool r1 = await SetTaskToStateAsync(id, AdminTaskState.Resolved);
            bool r2 = await SetResolvedByAsync(id, userId);
            return r1 && r2;
        }
        
        public async Task<bool> SetResolvedByAsync(string id, string userId)
        {
            var taskIdObj = new ObjectId(id);
            var userIdObj = new ObjectId(userId);

            var filter = DB.F<WikiAdminTaskEntity>().Eq(e => e.id, taskIdObj);
            var update = DB.U<WikiAdminTaskEntity>().Set(e => e.ResolvedBy_id, userIdObj);
            var res = await DB.UpdateAsync(filter, update);

            return res.ModifiedCount == 1;
        }

    }
}