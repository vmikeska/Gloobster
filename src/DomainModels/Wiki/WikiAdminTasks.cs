using System.Collections.Generic;
using System.Linq;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
    public class ExecutorInstance 
    {
        public static BaseAdminTaskExecutor GetExecutor(AdminTaskType type, IDbOperations db, IComponentContext componentContext)
        {
            BaseAdminTaskExecutor executor = null;

            if (type == AdminTaskType.ConfirmPhoto)
            {
                executor = new PhotoAdminTaskExecutor();
            }

            if (type == AdminTaskType.ResolveReport)
            {
                executor = new ReportAdminTaskExecutor();
            }

            executor.DB = db;
            executor.Initialize(componentContext);

            return executor;
        }
    }

    public class WikiAdminTasks : IWikiAdminTasks
    {
        public IDbOperations DB { get; set; }
        public IWikiPermissions Permissions { get; set; }
        public IComponentContext ComponentContext { get; set; }

        public void AddTask(NewTaskDO task)
        {
            var executor = ExecutorInstance.GetExecutor(task.TaskType, DB, ComponentContext);
            executor.AddTask(task);            
        }

        public List<TaskDO> GetUnresolvedTasks(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var permissions = DB.C<WikiPermissionEntity>().FirstOrDefault(u => u.User_id == userIdObj);
            if (permissions == null)
            {
                return null;
            }

            var outTasks = new List<WikiAdminTaskEntity>();
            var allUnresolvedTasks = DB.C<WikiAdminTaskEntity>().Where(t => t.State == AdminTaskState.New).ToList();

            if (permissions.IsMasterAdmin || permissions.IsSuperAdmin)
            {
                outTasks = allUnresolvedTasks;
            }
            else
            {
                foreach (var task in allUnresolvedTasks)
                {
                    bool hasPermissions = Permissions.HasArticleAdminPermissions(userId, task.Article_id.ToString());
                    if (hasPermissions)
                    {
                        outTasks.Add(task);
                    }
                }
            }

            var ts = outTasks.Select(ConvertToTask).ToList();
            return ts;
        }

        private TaskDO ConvertToTask(WikiAdminTaskEntity task)
        {
            var executor = ExecutorInstance.GetExecutor(task.Type, DB, ComponentContext);
            
            var t = new TaskDO
            {
                Id = task.id.ToString(),
                Caption = executor.Caption,
                Actions = executor.Operations.Select(o => new ActionDO {Name = o.Name, Caption = o.Caption}).ToList(),
                TaskType = task.Type,
                ArticleId = task.Article_id.ToString(),
                TargetId = task.Target_id.ToString(),
                Data = task.Data
            };
            
            return t;
        }
    }


    

    
}