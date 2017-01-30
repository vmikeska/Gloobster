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
    public class ReportAdminTaskExecutor : BaseAdminTaskExecutor
    {
        public override string Caption => "Resolve report";

        public override void Initialize(IComponentContext componentContext)
        {
            var resolve = componentContext.ResolveKeyed<IExecOperation>("SetToResolvedOperation");
            Operations = new List<IExecOperation> { resolve };
        }

        public override void AddTask(NewTaskDO taskDO)
        {
            var reportIdObj = new ObjectId(taskDO.TargetId);

            var task = GetNewTask(taskDO.ArticleId, taskDO.UserId, AdminTaskType.ResolveReport);
            task.Target_id = reportIdObj;
            task.Data = taskDO.Data;

            DB.SaveAsync(task);
        }
    }

    public class SetToResolvedOperation : IExecOperation
    {
        public IWikiReportDomain Report { get; set; }
        public IDbOperations DB { get; set; }

        public string Name => "Resolve";
        public string Caption => "Resolve";

        public async Task<bool> Execute(TaskExecuteDO action)
        {
            var opUtils = new OperationUtils(DB);
            var task = opUtils.GetTaskById(action.TaskId);

            bool result = await Report.SetState(task.Target_id.ToString(), AdminTaskState.Resolved);
            
            if (result)
            {
                await opUtils.SetToResolvedAsync(action.TaskId, action.UserId);
            }

            return result;
        }
    }
    
}