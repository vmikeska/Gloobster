using System.Collections.Generic;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
    public class PhotoAdminTaskExecutor : BaseAdminTaskExecutor
    {        
        public override string Caption => "Confirm photo";
        
        public override void Initialize(IComponentContext componentContext)
        {
            var delete = componentContext.ResolveKeyed<IExecOperation>("DeletePhotoOperation");
            var confirm = componentContext.ResolveKeyed<IExecOperation>("ConfirmPhotoOperation");
            Operations = new List<IExecOperation> { delete, confirm };
        }

        public override void AddTask(NewTaskDO taskDO)
        {
            var photoIdObj = new ObjectId(taskDO.TargetId);

            var task = GetNewTask(taskDO.ArticleId, AdminTaskType.ConfirmPhoto);
            task.Target_id = photoIdObj;
            task.Data = taskDO.Data;

            DB.SaveAsync(task);
        }
    }
    
    public class ConfirmPhotoOperation : IExecOperation
    {
        public IArticlePhoto ArticlePhoto { get; set; }
        public IDbOperations DB { get; set; }

        public string Name => "Confirm";
        public string Caption => "Confirm";

        public async Task<bool> Execute(TaskExecuteDO action)
        {
            var opUtils = new OperationUtils(DB);
            var task = opUtils.GetTaskById(action.TaskId);
            
            bool result = await ArticlePhoto.Confirm(action.UserId, task.Article_id.ToString(), task.Target_id.ToString());

            if (result)
            {
                await opUtils.SetToResolvedAsync(action.TaskId, action.UserId);
            }

            return result;
        }
    }

    public class DeletePhotoOperation : IExecOperation
    {
        public IArticlePhoto ArticlePhoto { get; set; }
        public IDbOperations DB { get; set; }

        public string Name => "Delete";
        public string Caption => "Delete";

        public async Task<bool> Execute(TaskExecuteDO action)
        {
            var opUtils = new OperationUtils(DB);
            var task = opUtils.GetTaskById(action.TaskId);

            bool result = ArticlePhoto.Delete(action.UserId, task.Article_id.ToString(), task.Target_id.ToString());

            if (result)
            {
                await opUtils.SetTaskToStateAsync(action.TaskId, AdminTaskState.Resolved);
            }

            return result;
        }
    }
}