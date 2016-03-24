using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class AdminActionController : BaseApiController
    {
        public IWikiAdminTasks AdminTasks { get; set; }
        public IComponentContext ComponentContext { get; set; }

        public AdminActionController(IComponentContext componentContext, IWikiAdminTasks adminTasks, ILogger log, IDbOperations db) : base(log, db)
        {
            AdminTasks = adminTasks;
            ComponentContext = componentContext;
        }
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] AdminActionRequest req)
        {
            var taskIdObj = new ObjectId(req.id);

            var task = DB.C<WikiAdminTaskEntity>().FirstOrDefault(t => t.id == taskIdObj);

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
}