using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Wiki;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Newtonsoft.Json;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.NewAdmin.Wiki
{
    public class WikiAdminActionController : BaseApiController
    {
        public IWikiAdminTasks AdminTasks { get; set; }
        public IComponentContext ComponentContext { get; set; }

        public WikiAdminActionController(IComponentContext componentContext, IWikiAdminTasks adminTasks, ILogger log, IDbOperations db) : base(log, db)
        {
            AdminTasks = adminTasks;
            ComponentContext = componentContext;
        }

        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get()
        {
            List<TaskDO> tasks = AdminTasks.GetUnresolvedTasks(UserId);

            var resp = tasks.Select(ConvertTask).ToList();
            
            return new ObjectResult(resp);
        }

        private WikiTaskResponse ConvertTask(TaskDO task)
        {
            var aid = new ObjectId(task.ArticleId);
            
            var resp = new WikiTaskResponse
            {
                id = task.Id,
                articleId = task.ArticleId,                
                caption = task.Caption,                
                taskType = task.TaskType,
                targetId = task.TargetId,
                actions = task.Actions.Select(a => new ActionTaskResponse { caption = a.Caption, name = a.Name}).ToList(),

                creatorId = task.CreatorId
            };

            var cidObj = new ObjectId(task.CreatorId);
            var user = DB.FOD<UserEntity>(u => u.User_id == cidObj);
            if (user != null)
            {
                resp.creatorName = user.DisplayName;
            }

            var lang = "en";

            if (task.TaskType == AdminTaskType.ConfirmPhoto)
            {
                resp.data = JsonConvert.DeserializeObject<ArticlePhotoData>(task.Data);
            }

            if (task.TaskType == AdminTaskType.ResolveReport)
            {
                var data = JsonConvert.DeserializeObject<ReportTaskData>(task.Data);                
                resp.data = data;
                
                lang = data.Lang;
            }

            var wte = DB.FOD<WikiTextsEntity>(t => t.Article_id == aid && t.Language == lang);

            resp.articleTitle = wte.Title;
            resp.link = wte.LinkName;

            return resp;
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] AdminActionRequest req)
        {
            var taskIdObj = new ObjectId(req.id);

            var task = DB.FOD<WikiAdminTaskEntity>(t => t.id == taskIdObj);

            var executor = ExecutorInstance.GetExecutor(task.Type, DB, ComponentContext);

            var operation = executor.GetOperationByName(req.action);

            var taskExecute = new TaskExecuteDO
            {
                TaskId = req.id,
                UserId = UserId
            };

            var result = await operation.Execute(taskExecute);

            return new ObjectResult(result);
        }

    }

    public class WikiTaskResponse
    {
        public string id { get; set; }
        public string articleId { get; set; }
        public string articleTitle { get; set; }
        public string targetId { get; set; }
        public string link { get; set; }

        public string creatorId { get; set; }
        public string creatorName { get; set; }


        public AdminTaskType taskType { get; set; }
        
        public dynamic data { get; set; }

        public string caption { get; set; }
        public List<ActionTaskResponse> actions { get; set; }
    }

    public class ActionTaskResponse
    {
        public string caption { get; set; }
        public string name { get; set; }
    }
}